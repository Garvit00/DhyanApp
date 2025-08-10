/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { collection, getDocs, limit, query, startAfter, where } from "firebase/firestore";
import { firestore } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import InteractiveStars from "../InteractiveStars";
import Navbar from "../Navbar";
import Contact from "../Contact";
import Footer from "../Footer";

export function Blogs() {
    const navigate = useNavigate();
    const [blogType, setBlogType] = useState(0);
    const [lastBlog, setLastBlog] = useState(null);
    const [loading, setLoading] = useState(false);
    const blogCategory = ["Knowledge", "Service", "Devotion", "Yoga", "Meditation"];
    const [blogs, setBlogs] = useState<any>([]);
    const [isMoreBlogs, setIsMoreBlogs] = useState(true) as any;
    const [searchString, setSearchString] = useState("") as any;
    const [mouse, setMouse] = useState({ x: 0, y: 0 });
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        
        const checkScreenSize = () => {
            setIsDesktop(window.innerWidth >= 768);
        };
        
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const handleMouseMove = (e: React.MouseEvent) => {
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = -(e.clientY / window.innerHeight) * 2 + 1;
        setMouse({ x, y });
    };

    // Initial blog fetch
    useEffect(() => {
        const fetchData = async () => {
            try {
                const q = query(
                    collection(firestore, 'articleFilesV1'),
                    where('ArticleCategory', '==', blogCategory[blogType]),
                    where('availableOnWebsite', '==', true),
                    limit(6)
                );
                const snapshot = await getDocs(q);
                const newData = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                console.log("blog Data is ", newData);
                setBlogs(newData);
                if (newData.length > 0) {
                    setLastBlog(snapshot.docs[newData.length - 1] as any);
                }
                if (newData.length < 6) {
                    setIsMoreBlogs(false);
                } else {
                    setIsMoreBlogs(true);
                }
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };

        fetchData();
    }, [blogType]);

    // Load more blogs (pagination)
    const loadMoreBlogs = async () => {
        setLoading(true);
        try {
            if (lastBlog) {
                const q = query(
                    collection(firestore, 'articleFilesV1'),
                    where('ArticleCategory', '==', blogCategory[blogType]),
                    where('availableOnWebsite', '==', true),
                    startAfter(lastBlog),
                    limit(6)
                );
                const snapshot = await getDocs(q);
                const newData = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                if (newData.length > 0) {
                    setLoading(false);
                    setBlogs((prevBlogs: any) => [...prevBlogs, ...newData]);
                    setLastBlog(snapshot.docs[newData.length - 1] as any);
                } else {
                    console.log("No more blogs available");
                    setLoading(false);
                }

                if (newData.length < 6) {
                    setIsMoreBlogs(false);
                }
            }
        } catch (error) {
            console.error("Error fetching more blogs:", error);
            setLoading(false);
        }
    };

    // Search functionality
    const fetchSearchResults = async () => {
        if (!searchString.trim()) return;
        
        try {
            const q = query(
                collection(firestore, 'articleFilesV1'),
                where('ArticleCategory', '==', blogCategory[blogType]),
                where('availableOnWebsite', '==', true),
                where('tags', 'array-contains', searchString.toLowerCase()),
                limit(6)
            );

            const querySnapshot = await getDocs(q);
            const results = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setBlogs(results);
            setIsMoreBlogs(false); // Disable load more for search results
            console.log("searchFunctionality", results);
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "Recently";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-GB', { 
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
        } catch {
            return "Recently";
        }
    };

    const BlogCard = ({ post }: { post: any }) => (
        <div 
            style={{
                width: '100%', 
                height: '100%', 
                padding: '18.15px', 
                background: 'white', 
                borderRadius: '23.99px', 
                outline: '1.51px #EEEEEE solid', 
                outlineOffset: '-1.51px', 
                flexDirection: 'column', 
                justifyContent: 'center', 
                alignItems: 'center', 
                gap: '12px', 
                display: 'inline-flex',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
            }}
            className="hover:shadow-lg hover:-translate-y-1"
            onClick={() => navigate(`/blog/${post.id}?type=${post.ArticleCategory}`)}
        >
            <div style={{alignSelf: 'stretch', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '20.99px', display: 'flex'}}>
                <div style={{alignSelf: 'stretch', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '18.15px', display: 'flex'}}>
                    <div style={{alignSelf: 'stretch', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '12.10px', display: 'flex'}}>
                        <div style={{alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'center', gap: '18.15px', display: 'inline-flex'}}>
                            <div style={{flex: '1 1 0', justifyContent: 'flex-start', alignItems: 'center', gap: '14.99px', display: 'flex'}}>
                                <div style={{flex: '1 1 0', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '6.05px', display: 'flex'}}>
                                    <div style={{color: '#7B7B7B', fontSize: '18px', fontFamily: 'Inter', fontWeight: '400', lineHeight: '25.20px', wordWrap: 'break-word'}}>Posted on</div>
                                    <div style={{color: '#676767', fontSize: '18.15px', fontFamily: 'Satoshi', fontWeight: '400', wordWrap: 'break-word'}}>•</div>
                                    <div style={{color: '#7B7B7B', fontSize: '18px', fontFamily: 'Inter', fontWeight: '400', lineHeight: '25.20px', wordWrap: 'break-word'}}>{formatDate(post.date)}</div>
                                </div>
                            </div>
                            <div style={{width: '30.25px', height: '30.25px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'}}>
                                <svg width="16" height="4" viewBox="0 0 16 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="2" cy="2" r="2" fill="#141414"/>
                                    <circle cx="8" cy="2" r="2" fill="#141414"/>
                                    <circle cx="14" cy="2" r="2" fill="#141414"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <img 
                        style={{width: '100%', height: '269.90px', borderRadius: '10.59px', objectFit: 'cover'}} 
                        src={post.teaserImageURL || "/blog-1.jpg"}
                        alt={post.primaryTitle}
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = "/blog-1.jpg";
                        }}
                    />
                </div>
            </div>
            <div style={{width: '100%', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '6.05px', display: 'inline-flex'}}>
                <div style={{color: '#141414', fontSize: '20px', fontFamily: 'Inter', fontWeight: '600', lineHeight: '24px', wordWrap: 'break-word'}}>
                    {post.primaryTitle.length > 60 ? `${post.primaryTitle.slice(0, 60)}...` : post.primaryTitle}
                </div>
            </div>
            <div style={{alignSelf: 'stretch'}}>
                <span style={{color: '#676767', fontSize: '18px', fontFamily: 'Inter', fontWeight: '400', lineHeight: '25.20px', wordWrap: 'break-word'}}>
                    {post.subTitle ? 
                        (post.subTitle.length > 80 ? `${post.subTitle.slice(0, 80)}...` : post.subTitle) :
                        "Discover insights on meditation, spirituality, and mindful living..."
                    }
                </span>
                <span style={{color: '#007AFF', fontSize: '18px', fontFamily: 'Inter', fontWeight: '500', lineHeight: '25.20px', wordWrap: 'break-word', textDecoration: 'none'}}> Read Full Article →</span>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen relative overflow-hidden" onMouseMove={handleMouseMove}>
            {/* Navbar */}
            <div className="relative z-50">
                <Navbar />
            </div>

            {/* Header with Interactive Stars */}
            <div className="relative w-full bg-black" style={{ height: isDesktop ? '400px' : '250px' }}>
                {/* Stars background */}
                <div className="absolute inset-0 z-0">
                    <Canvas
                        camera={{ position: [0, 0, 10], fov: isDesktop ? 60 : 75 }}
                        style={{ 
                            pointerEvents: "none", 
                            width: '100%', 
                            height: '100%',
                            background: 'transparent'
                        }}
                        gl={{ alpha: true, antialias: true }}
                    >
                        <InteractiveStars mouse={mouse} />
                    </Canvas>
                </div>
                {/* Gradient overlay for better text readability */}
                <div className="absolute inset-0 z-5 bg-gradient-to-b from-transparent via-black/20 to-black/40"></div>
                {/* Overlay content: Title and Search only */}
                {/* Title and Search Section - Figma alignment fix */}
                <div className="relative z-20 py-48 max-w-7xl mx-auto px-8" style={{ minHeight: '180px', display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', gap: '32px' }}>
                    {/* Title */}
                    <h1 
                        className="text-white font-bold"
                        style={{
                            fontFamily: '"Gelica", sans-serif',
                            fontSize: '80px',
                            fontWeight: 400,
                            lineHeight: '95px',
                            textAlign: 'left',
                            margin: 0
                        }}
                    >
                        Blogs
                    </h1>
                    {/* Search Bar */}
                    <div className="flex items-center justify-end gap-4" style={{ minWidth: 400 }}>
                        <div 
                            style={{
                                width: '350px',
                                height: '68px',
                                padding: '20px 30px 20px 42px',
                                background: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: '34px',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                backdropFilter: 'blur(20px)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px'
                            }}
                        >
                            <div style={{
                                width: '20px',
                                height: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <svg 
                                    width="18" 
                                    height="18" 
                                    viewBox="0 0 20 20" 
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path 
                                        d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35" 
                                        stroke="rgba(255, 255, 255, 0.7)" 
                                        strokeWidth="2" 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search"
                                value={searchString}
                                onChange={(e) => setSearchString(e.target.value)}
                                className="bg-transparent border-none outline-none flex-1 placeholder-white placeholder-opacity-70"
                                style={{
                                    fontFamily: 'SF Pro Display',
                                    fontWeight: '400',
                                    fontSize: '16px',
                                    borderRadius: '24px',
                                    color: '#FFFFFF'
                                }}
                            />
                        </div>
                        <button 
                            onClick={fetchSearchResults}
                            style={{
                                width: 'clamp(120px, 14vw, 220px)',
                                height: 'clamp(40px, 4.5vw, 60px)',
                                background: 'linear-gradient(360deg, #007AFF 0%, #04BEFE 100%)',
                                borderRadius: '20px',
                                border: '1px #B8B8B8 solid',
                                color: 'white',
                                fontSize: 'clamp(14px, 1.5vw, 20px)',
                                fontFamily: 'SF Pro Display',
                                fontWeight: '400',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center',
                                minWidth: '100px',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                zIndex: 2,
                                position: 'relative'
                            }}
                            className="transition-all hover:scale-105 flex-shrink-0"
                        >
                            Search
                        </button>
                    </div>
                </div>
            </div>

            {/* Blog Background Images (below header) */}
            <div className="absolute inset-0 z-0" style={{ top: isDesktop ? '400px' : '250px' }}>
                <div 
                    className="absolute inset-0"
                    style={{
                        backgroundImage: "url('/images/bg.webp')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        width: '100%',
                        minHeight: '100vh',
                    }}
                />
            </div>

            {/* Main Content */}
            <div className="relative z-20 max-w-7xl mx-auto px-4" style={{ paddingTop: isDesktop ? '8px' : '8px', paddingBottom: '32px' }}>
                <div 
                    className="flex justify-center mb-8 px-6"
                    style={{
                        gap: 'clamp(6px, 1.5vw, 20px)',
                        flexWrap: 'nowrap',
                        width: '100%',
                        maxWidth: '100vw',
                        overflowX: 'auto',
                        paddingTop: '8px',    
                        paddingBottom: '8px', 
                    }}
                >
                    {blogCategory.map((category, i) => (
                        <button
                            key={category}
                            onClick={() => { 
                                setBlogType(i); 
                                setLastBlog(null);
                                setIsMoreBlogs(true); 
                                setSearchString(''); // Clear search when changing category
                            }}
                            className="transition-all hover:scale-105 flex-shrink-0"
                            style={{
                                width: 'clamp(120px, 14vw, 220px)',
                                height: 'clamp(40px, 4.5vw, 60px)',
                                background: blogType === i 
                                    ? 'linear-gradient(360deg, #007AFF 0%, #04BEFE 100%)'
                                    : 'linear-gradient(0deg, #E8F3FF 0%, #E8F3FF 100%), linear-gradient(360deg, #007AFF 0%, #04BEFE 100%)',
                                borderRadius: '20px',
                                border: '1px #B8B8B8 solid',
                                color: blogType === i ? 'white' : '#6F6F6F',
                                fontSize: 'clamp(14px, 1.5vw, 20px)',
                                fontFamily: 'SF Pro Display',
                                fontWeight: '400',
                                wordWrap: 'break-word',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center',
                                minWidth: '100px',
                                zIndex: blogType === i ? 2 : 1, // bring active/hovered button to front
                                position: 'relative',           // ensure z-index works
                            }}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Blog Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {blogs.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                            <div className="text-xl text-white">No blogs found for this category.</div>
                        </div>
                    ) : (
                        blogs.map((post: any) => (
                            <BlogCard key={post.id} post={post} />
                        ))
                    )}
                </div>
                {/* Load More Button */}
                {isMoreBlogs && blogs.length > 0 && (
                    <div className="text-center">
                        <button 
                            onClick={loadMoreBlogs}
                            disabled={loading}
                            className="inline-flex items-center gap-3 text-white px-8 py-4 rounded-full font-medium hover:opacity-90 transition-all text-lg shadow-lg"
                            style={{
                                background: 'linear-gradient(90deg, #007AFF 0%, #04BEFE 100%)',
                                fontSize: '18px',
                                fontFamily: 'SF Pro Display',
                                fontWeight: '500'
                            }}
                        >
                            {loading ? "Loading..." : "Load more blogs"}
                            {!loading && (
                                <svg 
                                    className="w-[7px] h-[11px] ml-1"
                                    viewBox="0 0 7 11" 
                                    fill="none" 
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path 
                                        d="M1 1L6 5.5L1 10" 
                                        stroke="white" 
                                        strokeWidth="1.5" 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            )}
                        </button>
                    </div>
                )}
            </div>

            {/* Contact Section */}
            <div className="relative z-20">
                <Contact />
            </div>
            {/* Footer Section */}
            <div className="relative z-20">
                <Footer />
            </div>
        </div>
    );
} 