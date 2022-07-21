import axios from 'axios';
import { signIn, useSession } from 'next-auth/react';
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import { getError } from '../utils/error';

export default function ProfileScreen() {
  const { data: session } = useSession();
  const user = session?.user;

  const {
    handleSubmit,
    getValues,
    setValue,
    register,
    formState: { errors }
  } = useForm();

  useEffect(() => {
    setValue('name', user?.name);
    setValue('email', user?.email);
  }, [setValue, user]);

  const submitHandler = async ({name, email, password}) => {
    try {
      await axios.put('/api/auth/update', {
        name,
        email,
        password,
      });
      if (!password) {
        session.user.name = name;
        session.user.email = email;
        return toast.success('Profile updated successfully.');
      }
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password
      });
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Profile updated successfully');
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    <Layout title="Profile">
      <h1 className="mb-4 text-lg">Profile</h1>
      <form
        className='mx-auto max-w-screen-md'
        onSubmit={handleSubmit(submitHandler)}>
          <h1 className="mb-4 text-xl">Update Profile</h1>
          <div className="mb-4">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              className='w-full'
              id='name'
              autoFocus
              {...register('name',
              {
                        required: 'Please enter name'
                      })
              }/>
              {errors.name && (<div className='text-red-500'>{errors.name.message}</div>)}
          </div>
          <div className="mb-4">
            <label htmlFor="email">email</label>
            <input
              type="email"
              className='w-full'
              id='email'
              {...register('email',
              {
                        required: 'Please enter email',
                        pattern: {
                          value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i,
                          message: 'Please enter a valid email'
                        }
                      })
              }/>
              {errors.email && (<div className='text-red-500'>{errors.email.message}</div>)}
          </div>
          <div className="mb-4">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className='w-full'
              id='password'
              {...register('password',
              {
                        minLength: { value: 6, message: 'password should be at least 5 characters' }
                      })
              }/>
              {errors.password && (<div className='text-red-500'>{errors.password.message}</div>)}
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              className='w-full'
              id='confirmPassword'
              {...register('confirmPassword',
              {
                        validate: (value) => value === getValues('password'),
                        minLength: { value: 6, message: 'confirm password should be at least 5 characters' }
                      })
              }/>
              {errors.confirmPassword && (<div className='text-red-500'>{errors.confirmPassword.message}</div>)}
              {errors.confirmPassword && errors.confirmPassword.type === 'validate'
                && (<div className='text-red-500'>Passwords do not match</div>)}
          </div>
          <div className="mb-4">
            <button className="primary-button">Update Profile</button>
          </div>
      </form>
    </Layout>
  )
}
