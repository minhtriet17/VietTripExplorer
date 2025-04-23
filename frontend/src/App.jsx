import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SignInForm from './auth/forms/SignInForm'
import SignUpForm from './auth/forms/SignUpForm'
import Home from './pages/Home'
import About from './pages/About'
import Dashboard from './pages/Dashboard'
import NewsArcticles from './pages/NewsArcticles'
import Header from './components/shared/Header'

import { Toaster } from "@/components/ui/sonner"
import Footer from './components/shared/Footer'
import PrivateRoute from './components/shared/PrivateRoute'
import CreatePost from './pages/CreatePost'
import AdminPrivateRoute from './components/shared/AdminPrivateRoute'
import EditPost from './pages/EditPost'
import PostDetails from './pages/PostDetails'
import ScrollToTop from './components/shared/ScrollToTop'
import Search from './pages/Search'
import CreateTrip from './pages/CreateTrip'
import ViewTrip from './pages/ViewTrip'
import MyTrip from './pages/MyTrip'
import EmailVerifyPage from './pages/EmailVerifyPage'


const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <ScrollToTop />
      <Routes>
        <Route path="/Sign-in" element={<SignInForm />}/>
        <Route path="/Sign-up" element={<SignUpForm />}/>
        <Route path="/verify-email" element={<EmailVerifyPage />} />

        <Route path="/" element={<Home />}/>
        <Route path="/about" element={<About />}/>
        <Route path="/search" element={<Search />}/>

        <Route path="/create-trip" element={<CreateTrip />}/>
        <Route path="/view-trip/:tripSlug" element={<ViewTrip />}/>
        <Route path="/plans" element={<MyTrip />}/>

        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />}/>
        </Route>

        <Route element={<AdminPrivateRoute />}>
          <Route path='/create-post' element={<CreatePost/>}/>
          <Route path='/update-post/:postId' element={<EditPost/>}/>
        </Route>

        <Route path="/news" element={<Search />}/>
        <Route path="/post/:postSlug" element={<PostDetails />}/>
      </Routes>

      <Footer/>

      <Toaster />
    </BrowserRouter>
  )
}

export default App