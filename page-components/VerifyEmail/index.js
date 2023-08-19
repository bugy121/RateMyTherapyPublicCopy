import { ButtonLink } from '../../components/Buttons';
import { Container, Spacer, Wrapper } from '../../components/layout';
import { Text } from '../../components/text';
import Link from 'next/link';
import styles from './verifyEmail.module.css';

export const VerifyEmail = ({ valid }) => {
  return (
    <Wrapper className={styles.root}>
      <Container column alignItems="center">
        <Text
          className={styles.text}
          color={valid ? 'success-light' : 'secondary'}
        >
          {valid
            ? 'Thank you for verifying your email address. You may close this page.'
            : 'It looks like you may have clicked on an invalid link. Please close this window and try again.'}
        </Text>
        <Spacer size={4} axis="vertical" />
        <Link href="/" passHref>
          <ButtonLink variant="ghost" type="success" size="large">
            Go back home
          </ButtonLink>
        </Link>
      </Container>
    </Wrapper>
  );
};