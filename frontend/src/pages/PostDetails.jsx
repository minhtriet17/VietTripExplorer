import Advertise from '@/components/shared/Advertise'
import CommentSection from '@/components/shared/CommentSection'
import PostCard from '@/components/shared/PostCard'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

const PostDetails = () => {
    const {postSlug} = useParams()

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [post, setPost] = useState(null)
    const [recentArticles, setRecentArticles] = useState(null)

    //console.log(recentArticles)

    // console.log(post)
    useEffect(() => {
        const fetchPost = async() => {
            try {
                setLoading(true)

                const res = await fetch(`/api/post/getposts?slug=${postSlug}`)

                const data = await res.json()

                if (!res.ok) {
                    setError(true)
                    setLoading(false)

                    return
                }

                if(res.ok) {
                    setPost(data.posts[0])
                    setLoading(false)
                    setError(true)
                }
            } catch (error) {
                setError(true)
                setLoading(false)
            }
        }

        fetchPost()
    }, [postSlug])

    useEffect(() => {
        try {
            const fetchRecentPosts = async() => {
                const res = await fetch(`/api/post/getposts?limit=3`)

                const data = await res.json()

                if(res.ok) {
                    setRecentArticles(data.posts)
                }
            }

            fetchRecentPosts()
        } catch (error) {
            console.log(error.message)
        }
    }, [])

    if(loading) {
        return <div className='flex justify-center items-center min-h-screen'>
            <img src="https://cdn-icons-png.flaticon.com/128/39/39979.png" alt="loading" 
                className='w-20 animate-spin'/>
        </div>
    }
    return (
        <main className="px-4 sm:px-6 lg:px-8 flex flex-col max-w-6xl mx-auto min-h-screen">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-slate-700 mt-12 mb-4 underline">
            {post && post.title}
          </h1>
      
          <Link to={`/search?category=${post && post.category}`} className="self-center mt-4">
            <Button variant="outline" className="border border-slate-500 px-4 py-2 text-sm sm:text-base">
              {post && post.category}
            </Button>
          </Link>
      
          <img
            src={post && post.image}
            alt={post && post.title}
            className="mt-8 w-full max-h-[500px] object-cover rounded-xl shadow-md"
          />
      
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 px-3 mx-auto w-full max-w-2xl text-xs sm:text-sm text-slate-600 mt-4">
            <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
            <span>{post && (post.content.length / 100).toFixed(0)} mins read</span>
          </div>
      
          <Separator className="bg-slate-400 my-6 max-w-3xl mx-auto" />
      
          <div
            className="prose prose-sm sm:prose lg:prose-lg px-3 max-w-3xl mx-auto w-full text-justify"
            dangerouslySetInnerHTML={{ __html: post && post.content }}
          ></div>
      
          <CommentSection postId={post._id} />
      
          <div className="flex flex-col items-center mt-12 mb-8 px-3">
            <h2 className="text-lg sm:text-xl font-semibold text-slate-700 mb-6">
              Các bài viết gần đây
            </h2>
      
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full justify-items-center">
              {recentArticles &&
                recentArticles.map((post) => <PostCard key={post._id} post={post} />)}
            </div>
          </div>
        </main>
      );
}

export default PostDetails 