import Head from 'next/head'
import Link from 'next/link'
import Router from 'next/router'
import { isAuth, logout } from '../helpers/auth'
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import React from 'react'

Router.onRouteChangeStart = (url) => Nprogress.start()
Router.onRouteChangeComplete = (url) => Nprogress.done()
Router.onRouteChangeError = (url) => Nprogress.done()

const Layout = ({ children }) => {
  const head = () => (
    <>
      <link rel='stylesheet' href='/static/css/styles.css' />
      <link
        rel='stylesheet'
        href='https://cdn.jsdelivr.net/npm/bootswatch@4.5.2/dist/pulse/bootstrap.min.css'
        integrity='sha384-L7+YG8QLqGvxQGffJ6utDKFwmGwtLcCjtwvonVZR/Ba2VzhpMwBz51GaXnUsuYbj'
        crossOrigin='anonymous'
      />
    </>
  )
  const nav = () => (
    <nav className='navbar navbar-expand-lg fixed-top navbar-dark bg-primary'>
      <div className='container'>
        <a className='navbar-brand' href='/'>
          Brand
        </a>
        <button
          className='navbar-toggler'
          type='button'
          data-bs-toggle='collapse'
          data-bs-target='#navbarColor01'
          aria-controls='navbarColor01'
          aria-expanded='false'
          aria-label='Toggle navigation'
        >
          <span className='navbar-toggler-icon'></span>
        </button>

        <div className='collapse navbar-collapse' id='navbarColor01'>
          <ul className='navbar-nav'>
            <li className='nav-item'>
              <Link href='/'>
                <a className='nav-link'>Home</a>
              </Link>
            </li>

            {!isAuth() && (
              <React.Fragment>
                <li className='nav-item'>
                  <Link href='/login'>
                    <a className='nav-link'>Login</a>
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link href='/register'>
                    <a className='nav-link'>Register</a>
                  </Link>
                </li>
              </React.Fragment>
            )}
          </ul>
          <ul className='navbar-nav ms-md-auto'>
            {isAuth() && isAuth().role === 'admin' && (
              <li className='nav-item'>
                <Link href='/admin'>
                  <a className='nav-link'>{isAuth().name}</a>
                </Link>
              </li>
            )}

            {isAuth() && isAuth().role === 'subscriber' && (
              <li className='nav-item'>
                <Link href='/user'>
                  <a className='nav-link'>{isAuth().name}</a>
                </Link>
              </li>
            )}

            {isAuth() && (
              <li className='nav-item'>
                <a onClick={logout} className='nav-link'>
                  Logout
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )

  return (
    <>
      {head()}
      {nav()}
      <div className='container pb-5' style={{ paddingTop: '120px' }}>
        {children}
      </div>
      <script
        src='https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js'
        integrity='sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p'
        crossOrigin='anonymous'
      ></script>
    </>
  )
}

export default Layout
