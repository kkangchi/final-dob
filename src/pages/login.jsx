import { useState } from 'react'
import { Flex, Box, Heading, Button, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { auth } from '../firebase/config'
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { FcGoogle } from 'react-icons/fc'

export default function Login() {
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleLogin = async () => {
    if (isLoading) return // 이미 로딩 중이면 중복 실행 방지

    setIsLoading(true)
    setErrorMessage('')

    try {
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({
        prompt: 'select_account',
      })

      const result = await signInWithPopup(auth, provider)

      if (result.user) {
        // 로그인 성공 처리
        localStorage.setItem('isLoggedIn', 'true')
        localStorage.setItem('user', JSON.stringify(result.user))
        router.back()
      }
    } catch (error) {
      console.error('Google 로그인 에러:', error)
      if (error.code === 'auth/cancelled-popup-request') {
        setErrorMessage('로그인이 취소되었습니다.')
      } else if (error.code === 'auth/popup-blocked') {
        setErrorMessage('팝업이 차단되었습니다. 팝업 차단을 해제해주세요.')
      } else {
        setErrorMessage('구글 로그인 중 오류가 발생했습니다.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Flex height="100vh" alignItems="center" justifyContent="center">
      <Box
        p={8}
        maxWidth="500px"
        borderWidth={1}
        borderRadius={8}
        boxShadow="lg"
      >
        <Box textAlign="center">
          <Heading mb={6}>로그인</Heading>
        </Box>
        <Box my={4} textAlign="left">
          {errorMessage && (
            <Text color="red.500" mb={4}>
              {errorMessage}
            </Text>
          )}

          <Button
            width="full"
            onClick={handleGoogleLogin}
            leftIcon={<FcGoogle />}
            size="lg"
            isLoading={isLoading}
            loadingText="로그인 중..."
          >
            구글로 로그인
          </Button>
        </Box>
      </Box>
    </Flex>
  )
}
