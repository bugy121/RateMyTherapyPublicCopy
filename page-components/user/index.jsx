import styles from './user.module.css';
import UserHeader from './userHeader';

export const User = ({ user }) => {
  return (
    <div className={styles.root}>
      <UserHeader user={user} />
    </div>
  );
};
