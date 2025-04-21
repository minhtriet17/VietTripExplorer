import { Input } from '@/components/ui/input'
import React, { useEffect, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Button } from '@/components/ui/button'
import { useLocation, useNavigate } from 'react-router-dom'
import { Separator } from '@/components/ui/separator'
import PostCard from '@/components/shared/PostCard'

const Search = () => {
    const location = useLocation()
    console.log(location.search)
    const navigate = useNavigate()

    const [sidebarData, setSidebarData] = useState({
        searchTerm: '',
        sort: "",
        category: "",
    })

    // console.log(sidebarData)

    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(false)
    const [showMore, setShowMore] = useState(false)

    // console.log(posts)

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search)

        const searchTermFromUrl = urlParams.get('searchTerm')
        const sortFromUrl = urlParams.get('sort')
        const categoryFromUrl = urlParams.get('category')

        if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
            setSidebarData(prev =>({
                ...prev,
                searchTerm: searchTermFromUrl || "",
                sort: sortFromUrl || "",
                category: categoryFromUrl || "",
            }))
        }

        const fetchPosts = async () => {
            setLoading(true)

            const searchQuery = urlParams.toString()

            const res = await fetch(`/api/post/getposts?${searchQuery}`)

            if(!res.ok) {
                setLoading(false)
                return
            }

            if(res.ok) {
                const data = await res.json()
                setPosts(data.posts)
                setLoading(false)

                if(data.posts.length === 9) {
                    setShowMore(true)
                } else {
                    setShowMore(false)
                }
            }
        }

        fetchPosts()
    }, [location.search])

    const handleChange = (e) => {
        if(e.target.id === "searchTerm"){
            setSidebarData({
                ...sidebarData,
                searchTerm: e.target.value
            })
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const urlParams = new URLSearchParams(location.search)

        urlParams.set('searchTerm', sidebarData.searchTerm)
        urlParams.set('sort', sidebarData.sort)
        urlParams.set('category', sidebarData.category)

        const searchQuery = urlParams.toString()
        
        navigate(`/search?${searchQuery}`)
    }

    const handleShowMore = async () => {
        const numberOfPosts = posts.length
        const startIndex = numberOfPosts 
        const urlParams = new URLSearchParams(location.search)

        urlParams.set('startIndex', startIndex)

        const searchQuery = urlParams.toString()

        const res = await fetch(`/api/post/getposts?${searchQuery}`)

        if(!res.ok) {
            return
        }

        if(res.ok) {
            const data = await res.json()

            setPosts([...posts, ...data.posts])

            if(data.posts.length === 9) {
                setShowMore(true)
            } else {
                setShowMore(false) 
            }
        }
    }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
        {/* Mobile Filter Toggle Button */}
        <div className="md:hidden sticky top-0 z-10 bg-white shadow-md p-4">
            <Button
                onClick={() => document.getElementById('sidebar').classList.toggle('hidden')}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
                Toggle Filters
            </Button>
        </div>

        <div className='flex flex-col md:flex-row'>
        {/* Sidebar */}
        <aside className="hidden md:block md:w-80 bg-white shadow-md p-6 sticky top-0 h-fit md:h-screen">
            <form className='flex flex-col gap-6' onSubmit={handleSubmit}>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-700">Bộ Lọc Tìm Kiếm</h2>

                {/* Search Input */}
                <div className="flex flex-col gap-2">
                    <label className="font-medium text-gray-600 text-sm sm:text-base">Từ Khóa:</label>
                    <Input
                        placeholder="Nhập từ khóa..."
                        id="searchTerm"
                        type="text"
                        className="border-gray-300 rounded-md p-2 text-sm sm:text-base"
                        value={sidebarData.searchTerm}
                        onChange={handleChange}
                    />
                </div>

                {/* Sort By */}
                <div className="flex flex-col gap-2">
                    <label className="font-medium text-gray-600 text-sm sm:text-base">Sắp Xếp Theo:</label>
                    <Select
                        onValueChange={(value) => setSidebarData({ ...sidebarData, sort: value })}
                        value={sidebarData.sort}
                    >
                        <SelectTrigger className="w-full border-gray-300 rounded-md p-2 text-sm sm:text-base">
                        <SelectValue placeholder="Chọn thứ tự" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Sắp xếp theo:</SelectLabel>
                            <SelectItem value="desc">Mới nhất</SelectItem>
                            <SelectItem value="asc">Cũ nhất</SelectItem>
                        </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* Category */}
                <div className="flex flex-col gap-2">
                    <label className="font-medium text-gray-600 text-sm sm:text-base">Danh Mục:</label>
                    <Select
                        onValueChange={(value) => setSidebarData({ ...sidebarData, category: value })}
                        value={sidebarData.category}
                    >
                        <SelectTrigger className="w-full border-gray-300 rounded-md p-2 text-sm sm:text-base">
                        <SelectValue placeholder="Chọn danh mục" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Danh mục:</SelectLabel>
                            <SelectItem value="uncategorized">Tất cả</SelectItem>
                            <SelectItem value="travelnews">Tin Du Lịch</SelectItem>
                            <SelectItem value="travelguide">Hướng Dẫn Du Lịch</SelectItem>
                            <SelectItem value="touristarea">Khu Du Lịch</SelectItem>
                        </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* Submit Button */}
                <Button
                type="submit"
                className="bg-blue-600 text-white rounded-md py-2 sm:py-3 hover:bg-blue-700 transition-colors text-sm sm:text-base"
                >
                Áp Dụng Bộ Lọc
                </Button>
            </form>
        </aside>
        
        {/* Posts */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-700 mb-4">
                Kết Quả Tìm Kiếm
            </h1>

            <Separator className="bg-gray-300 mb-6"/>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {!loading && posts.length === 0 && (
                    <p className="text-gray-500 text-base sm:text-lg col-span-full text-center">
                        Không tìm thấy bài viết nào.
                    </p>
                )}
                
                {loading && (
                    <p className="text-gray-500 text-base sm:text-lg col-span-full text-center">
                        Đang tải bài viết...
                    </p>
                )}

                {!loading && posts && posts.map((post) => 
                    <PostCard key={post._id} post={post}/>
                )}

                {showMore && (
                    <div className="mt-8 text-center">
                        <button
                            onClick={handleShowMore}
                            className="text-blue-600 text-base sm:text-lg font-semibold hover:underline py-2 px-4 rounded-md transition-colors"
                        >
                            Xem Thêm
                        </button>
                  </div>
                )}
            </div>
        </div>
        </div>
    </div>
    
  )
}

export default Search