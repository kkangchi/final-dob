import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { AiOutlineMenu } from 'react-icons/ai'
import { IoMdClose } from 'react-icons/io'
import { FaUsers } from 'react-icons/fa'

const MobNav = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userInfo, setUserInfo] = useState(null)
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loginStatus = window.localStorage.getItem('isLoggedIn')
      setIsLoggedIn(loginStatus === 'true')

      const userStr = window.localStorage.getItem('user')
      if (userStr) {
        setUserInfo(JSON.parse(userStr))
      }
    }
  }, [])

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('isLoggedIn', 'false')
      window.localStorage.removeItem('user')
      setIsLoggedIn(false)
      setUserInfo(null)
      setIsOpen(false)
      router.push('/')
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '120px',
          padding: '10px',
          marginLeft: '20px',
          marginTop: '5px',
          borderRadius: '5px',
          backgroundColor: 'transparent',
          color: '#ceb4c2',
          border: 'none',
          cursor: 'pointer',
          fontSize: '50px',
        }}
      >
        <AiOutlineMenu />
      </button>

      {isOpen && (
        <div className="overlay">
          <div className="menu">
            <IoMdClose
              onClick={() => setIsOpen(false)}
              className="close-button"
              size={24}
            />

            {!isLoggedIn ? (
              <Link
                href="/login"
                className="menu-item"
                onClick={() => setIsOpen(false)}
              >
                로그인
              </Link>
            ) : (
              <>
                <div
                  className="menu-item"
                  style={{
                    color: '#333',
                    fontWeight: 'bold',
                  }}
                >
                  {userInfo?.displayName || '사용자'}
                </div>
                <button onClick={handleLogout} className="menu-item">
                  로그아웃
                </button>
                <div className="menu-divider"></div>
                <Link
                  href="/team"
                  className="menu-item"
                  onClick={() => setIsOpen(false)}
                >
                  <FaUsers className="menu-icon" />팀 소개
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default MobNav
