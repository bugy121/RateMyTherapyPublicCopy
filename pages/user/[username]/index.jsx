import { findUserByUsername } from '../../../api-lib/db';
import { getMongoDb } from '../../../api-lib/mongodb';
import { User } from '../../../page-components/user';
import Head from 'next/head';
import { Box, Flex } from '@chakra-ui/react'

export default function UserPage({ user }) {
  return (
    <Box bg='#152f46' h = '100vh'>
      <Head>
        <title>
        {user.name} (@{user.username})
        </title>
      </Head>
      <User user={user} />
    </Box> 
  );
}

export async function getServerSideProps(context) {
  const db = await getMongoDb();

  const user = await findUserByUsername(db, context.params.username);
  if (!user) {
    return {
      notFound: true,
    };
  }
  user._id = String(user._id);
  return { props: { user } };
}
