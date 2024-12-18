import { useEffect, useState } from 'react'
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Container,
  Button,
  Flex,
  Divider,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { ArrowBackIcon } from '@chakra-ui/icons'
import Image from 'next/image'

const TeamPage = () => {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const authStatus = localStorage.getItem('isLoggedIn')
      setIsAuthenticated(authStatus === 'true')

      if (authStatus !== 'true') {
        router.push('/login')
        return
      }
    }
  }, [router])

  const teamMembers = [
    {
      name: '정예빈',
      role: '팀장',
      image: '/kitty.jpg',
      description: '개인 웹 페이지 링크',
      link: '',
    },
    {
      name: '이서진',
      role: '팀원1',
      image: '/chunsik.jpg',
      description: '개인 웹 페이지 링크',
      link: 'https://final-portfolio-three-zeta.vercel.app',
    },
    {
      name: '오시은',
      role: '팀원2',
      image: '/damagochi.jpg',
      description: '개인 웹 페이지 링크',
      link: 'https://fp-kkangchis-projects.vercel.app',
    },
    {
      name: '서지영',
      role: '팀원3',
      image: '/jitang.jpg',
      description: '개인 웹 페이지 링크.',
      link: 'https://portfolio-final-psi-two.vercel.app',
    },
    {
      name: '장수정',
      role: '팀원4',
      image: '/ueeze.png',
      description: '개인 웹 페이지 링크',
      link: 'https://portfolio-nextjs-ivory-alpha.vercel.app',
    },
  ]

  if (!isAuthenticated) {
    return null
  }

  return (
    <Box>
      <Box
        as="nav"
        background="linear-gradient(90deg, #c467ce, #d5bed3, #ceb4c2)"
        color="white"
        py={4}
        px={8}
        position="fixed"
        top={0}
        left={0}
        right={0}
        zIndex={1000}
      >
        <Flex
          justify="space-between"
          align="center"
          maxW="container.xl"
          mx="auto"
        >
          <Heading size="md">胡蝶之夢</Heading>
          <Button
            leftIcon={<ArrowBackIcon />}
            variant="ghost"
            _hover={{ backgroundColor: '#d5bed3' }}
            color="white"
            onClick={() => router.back()}
          >
            뒤로가기
          </Button>
        </Flex>
      </Box>
      <Container maxW="container.xl" py={20} mt={16}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
          {teamMembers.map((member, index) => (
            <Box
              key={index}
              p={6}
              boxShadow="lg"
              borderRadius="md"
              textAlign="center"
              bg="white"
            >
              <Image
                src={member.image}
                alt={member.name}
                width={200}
                height={200}
                style={{
                  borderRadius: '100%',
                  objectFit: 'contain', // 'cover'에서 'contain'으로 변경
                  margin: '0 auto', // 가운데 정렬을 위해 추가
                  display: 'block', // 가운데 정렬을 위해 추가
                }}
              />
              <Heading size="md" mb={2}>
                {member.name}
              </Heading>
              <Text color="gray.500" mb={4}>
                {member.role}
              </Text>
              <Text>{member.description}</Text>
              <Box mt={4}>
                <Button
                  bg="#c467ce"
                  color="white"
                  _hover={{ bg: '#b355bd' }} // hover 시 약간 어두운 색상으로 변경
                  size="sm"
                  onClick={() => router.push(member.link)}
                >
                  <Image
                    src="/vercel.svg"
                    alt="vercel icon"
                    width={20}
                    height={20}
                  />
                </Button>
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      </Container>

      <Divider my={10} borderColor="#c467ce" width="80%" mx="auto" />
      <Container maxW="container.xl" py={10}>
        <Flex justify="space-between" align="center">
          <Heading size="2xl" textAlign="left" mb={8} color="#c467ce">
            중간고사 팀 프로젝트
            <br className="sm:block hidden" /> 버셀 링크
          </Heading>
          <Button
            bg="#c467ce"
            color="white"
            _hover={{ bg: '#b355bd' }}
            size="lg"
            onClick={() => window.open('https://dob-phi.vercel.app', '_blank')}
          >
            <Image src="/vercel.svg" alt="vercel icon" width={30} height={30} />
          </Button>
        </Flex>
      </Container>

      <Divider my={0} borderColor="#c467ce" width="80%" mx="auto" />

      <Container maxW="container.xl" py={10}>
        <Flex justify="space-between" align="center">
          <Heading size="2xl" textAlign="left" mb={8} color="#c467ce">
            팀 프로젝트
            <br className="sm:block hidden" /> 유튜브 링크
          </Heading>
          <Button
            bg="#c467ce"
            color="white"
            _hover={{ bg: '#b355bd' }}
            size="lg"
            onClick={() => window.open('여기에 유튜브 링크 넣기', '_blank')}
          >
            <Image
              src="/youtube.svg"
              alt="youtube icon"
              width={30}
              height={30}
            />
          </Button>
        </Flex>
      </Container>

      <Divider my={0} borderColor="#c467ce" width="80%" mx="auto" />

      <Container maxW="container.xl" py={10}>
        <Flex justify="space-between" align="center">
          <Heading size="xs" textAlign="left" mb={8} color="#c467ce">
            ⓒ team. 胡蝶之夢
          </Heading>
        </Flex>
      </Container>
    </Box>
  )
}

export default TeamPage
