import bcryptjs from "bcryptjs";
import nextAuth from "next-auth";
import User from "../../../models/User";
import db from "../../../utils/db";
import CredentialsProvider from "next-auth/providers/credentials"

export default nextAuth({
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({token, user}) {
      if (user?._id) {
        token._id = user.id
      }
      if (user?.isAdmin) {
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
    async session({session ,token}) {
      if (token?._id) {
        session._id = token.id
      }
      if (token?.isAdmin) {
        session.isAdmin = token.isAdmin;
      }
      return session;
    }
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        await db.connect();
        const user = await User.findOne({email: credentials.email});
        await db.disconnect();
        if (user && bcryptjs.compareSync(credentials.password, user.password)) {
          return {
            _id: user._id,
            name: user.name,
            email: user.email,
            image: 'f',
            isAdmin: user.isAdmin,
          };
        }
        throw new Error('Invalid email or password');
      }
    })
  ]
});
