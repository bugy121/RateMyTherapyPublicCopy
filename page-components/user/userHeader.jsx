import { Avatar } from '../../components/avatar';
import { Container } from '../../components/layout';
import styles from './userHeader.module.css';

const UserHeader = ({ user }) => {
  return (
    <Container className={styles.root} column alignItems="center">
      <div className={styles.avatar}>
        <Avatar size={168} username={user.username} url={user.profilePicture} />
      </div>
      <h1>
        <div className={styles.name}>{user.name}</div>
        <div className={styles.username}>@{user.username}</div>
      </h1>
      <p className={styles.bio}>{user.bio}</p>
    </Container>
  );
};

export default UserHeader;