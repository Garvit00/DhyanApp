
/* eslint-disable @typescript-eslint/no-explicit-any */
import { SlCalender } from "react-icons/sl";
import { IoPersonSharp } from "react-icons/io5";
import Markdown from "react-markdown";
import { Link, useLocation, useParams } from "react-router-dom";
import { firestore } from "../../firebase";
import { collection, doc, getDoc, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import getTime from "../../utils/getTime";
import { FaPlay, FaPause, FaForward, FaBackward } from "react-icons/fa";
import React from "react";

const BlogPage = () => {
    const location = useLocation();
    const pathSegments = location.pathname.split('/');
    const lastRouteName = pathSegments[pathSegments.length - 1];
    const { id } = useParams();
    const [data, setData] = useState<any>();
    const [blogs, setBlogs] = useState<any>();
    const [showBackToTop, setShowBackToTop] = useState(false);
    const queryParams = new URLSearchParams(window.location.search);
    const type = queryParams.get('type');

    const [audioState, setAudioState] = useState({
        playing: false,
        currentTime: 0,
        duration: 0,
        seeking: false
    });
    const audioRef = React.useRef<HTMLAudioElement>(null);

    const handlePlayPause = () => {
        if (!audioRef.current) return;
        if (audioState.playing) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setAudioState((s) => ({ ...s, playing: !s.playing }));
    };
    const handleTimeUpdate = () => {
        if (!audioRef.current) return;
        setAudioState((s) => ({ ...s, currentTime: audioRef.current!.currentTime }));
    };
    const handleLoadedMetadata = () => {
        if (!audioRef.current) return;
        setAudioState((s) => ({ ...s, duration: audioRef.current!.duration }));
    };
    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!audioRef.current) return;
        const time = parseFloat(e.target.value);
        audioRef.current.currentTime = time;
        setAudioState((s) => ({ ...s, currentTime: time }));
    };
    const skipTime = (amount: number) => {
        if (!audioRef.current) return;
        let newTime = audioRef.current.currentTime + amount;
        if (newTime < 0) newTime = 0;
        if (newTime > audioState.duration) newTime = audioState.duration;
        audioRef.current.currentTime = newTime;
        setAudioState((s) => ({ ...s, currentTime: newTime }));
    };
    const formatTime = (t: number) => {
        if (isNaN(t)) return "0:00";
        const m = Math.floor(t / 60);
        const s = Math.floor(t % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const speedOptions = [1, 1.5, 2, 0.5];
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const handleCycleSpeed = () => {
        const idx = speedOptions.indexOf(playbackSpeed);
        const next = speedOptions[(idx + 1) % speedOptions.length];
        setPlaybackSpeed(next);
        if (audioRef.current) audioRef.current.playbackRate = next;
    };
    useEffect(() => {
        if (audioRef.current) audioRef.current.playbackRate = playbackSpeed;
    }, [playbackSpeed]);

    // Fetch current blog post
    useEffect(() => {
        const fetchData = async () => {
            try {
                const docRef = doc(firestore, "articleFilesV1", lastRouteName);
                const docSnapshot = await getDoc(docRef);

                if (docSnapshot.exists()) {
                    setData({ id: docSnapshot.id, ...docSnapshot.data() });
                    console.log({ id: docSnapshot.id, ...docSnapshot.data() });
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.error('Error getting document:', error);
            }
        };

        fetchData();
    }, [lastRouteName]);

    // Fetch related blogs
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const q = query(
                    collection(firestore, 'articleFilesV1'), 
                    where('category', '==', type), 
                    orderBy('date', 'desc'), 
                    limit(4)
                );
                const snapshot = await getDocs(q);
                const newData = await snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                console.log("related blog Data is ", newData);
                setBlogs(newData);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };

        if (type) {
            fetchAllData();
        }
    }, [type]);

    const formatData = (longText: string) => {
        if (longText && /<br\s*\/?>/i.test(longText)) {
            return longText.replace(/<br\s*\/?>/gi, '\n').replace(/\n{2,}/g, '\n\n');
        } else {
            return longText;
        }
    };
//@ts-ignore
    const formatDate = (dateString: string) => {
        if (!dateString) return "Recently Updated";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        } catch {
            return "Recently Updated";
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Show/hide back to top button based on scroll position
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setShowBackToTop(scrollTop > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Scroll to top function
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <div className="h-full w-screen relative" 
             style={{
                 backgroundImage: "url('/images/bg.webp')",
                 backgroundSize: 'cover',
                 backgroundPosition: 'center',
                 backgroundRepeat: 'no-repeat',
                 minHeight: '100vh'
             }}>
            {/* Navbar */}
            <div className="relative z-50">
                <Navbar />
            </div>

            {/* Hero Section */}
            <div className="relative h-screen max-md:h-[50vh] w-full">
                <img 
                    className="h-full w-full absolute z-10 object-cover" 
                    src={data?.backgroundImageURL} 
                    onError={(e) => {
                        // Fallback to teaserImageURL if backgroundImageURL fails
                        const target = e.target as HTMLImageElement;
                        if (target.src !== data?.teaserImageURL && data?.teaserImageURL) {
                            target.src = data.teaserImageURL;
                        } else {
                            target.src = "/blog-1.jpg";
                        }
                    }}
                    onLoad={() => {
                        console.log('Background image loaded successfully:', data?.backgroundImageURL);
                    }}
                />
                {/* Gradient Overlay */}
                <div
                    className="absolute left-0 right-0 bottom-0 z-20 pointer-events-none"
                    style={{
                        height: '40%',
                        background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)"
                    }}
                />
                <div className="w-full z-30 text-white absolute bg-transparent h-full flex flex-col max-md:items-start justify-end p-14 max-md:p-5">
                    <Link 
                        to="/blogs" 
                        className="absolute top-5 left-5 flex items-center gap-2 px-6 py-3 rounded-full 
                                 bg-white/10 backdrop-blur-md border border-white/20 
                                 text-white font-medium text-base transition-all duration-300
                                 hover:bg-white/20 hover:border-white/30 hover:scale-105
                                 shadow-lg hover:shadow-xl"
                        style={{ fontFamily: '"SF Pro Display", sans-serif' }}
                    >
                        <svg 
                            className="w-4 h-4" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M10 19l-7-7m0 0l7-7m-7 7h18" 
                            />
                        </svg>
                        Back to Blogs
                    </Link>
                    <div>
                        <div 
                            style={{
                                background: "linear-gradient(90deg, rgba(20,20,20,0.85) 70%, rgba(20,20,20,0.4) 100%)",
                                borderRadius: "24px",
                                padding: "32px 40px",
                                display: "inline-block",
                                maxWidth: "90%",
                                marginBottom: "32px",
                                boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                                backdropFilter: "blur(8px)",
                                WebkitBackdropFilter: "blur(8px)",
                                border: "1.5px solid rgba(255,255,255,0.18)",
                                textShadow: "0 2px 8px rgba(0,0,0,0.25)"
                            }}
                        >
                            <div className="font-bigshoulderdisplay text-6xl max-md:text-2xl pb-4">
                                {data?.primaryTitle}
                            </div>
                            {data?.subTitle && (
                                <div className="text-2xl max-md:text-lg mb-4 opacity-90">
                                    {data.subTitle}
                                </div>
                            )}
                            <div className="flex items-center gap-5 max-md:gap-1 max-md:flex-col text-xl max-md:text-sm">
                                <div className="inline-flex gap-2 justify-center items-center">
                                    <IoPersonSharp />
                                    {data?.multiMediaType !== "spinnedAudio" ? data?.originalAuthorName : "Dhyan App"}
                                </div>
                                <div className="inline-flex gap-2 justify-center items-center">
                                    <SlCalender /> 
                                    Updated on: {data?.date ? getTime(data.date) : 'No date available'}
                                </div>
                                {data?.audioURL && (
                                    <div
                                        className="w-full max-w-[480px] min-w-0 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4"
                                        style={{
                                            background: "linear-gradient(90deg, rgba(20,20,20,0.85) 70%, rgba(20,20,20,0.4) 100%)",
                                            borderRadius: "16px",
                                            border: "1.5px solid rgba(255,255,255,0.18)",
                                            boxShadow: "0 4px 16px 0 rgba(31, 38, 135, 0.20)",
                                            padding: "8px 10px 8px 10px",
                                            width: '100%',
                                            minWidth: 0,
                                            marginLeft: 0,
                                        }}
                                    >
                                        <div className="flex items-center gap-2 w-full">
                                            <button onClick={() => skipTime(-5)} style={{ background: 'none', border: 'none', color: 'white', fontSize: 18, marginRight: 4, cursor: 'pointer' }}><FaBackward /></button>
                                            <button onClick={handlePlayPause} style={{ background: 'none', border: 'none', color: 'white', fontSize: 22, marginRight: 4, cursor: 'pointer' }}>
                                                {audioState.playing ? <FaPause /> : <FaPlay />}
                                            </button>
                                            <button onClick={() => skipTime(5)} style={{ background: 'none', border: 'none', color: 'white', fontSize: 18, marginRight: 8, cursor: 'pointer' }}><FaForward /></button>
                                            <span style={{ color: 'white', fontFamily: 'monospace', fontSize: 15, minWidth: 36, textAlign: 'right' }}>{formatTime(audioState.currentTime)}</span>
                                            <input
                                                type="range"
                                                min={0}
                                                max={audioState.duration || 0}
                                                value={audioState.currentTime}
                                                onChange={handleSeek}
                                                className="flex-1 mx-2 accent-cyan-400 h-1 rounded"
                                                style={{ minWidth: 0 }}
                                            />
                                            <span style={{ color: 'white', fontFamily: 'monospace', fontSize: 15, minWidth: 36, textAlign: 'left' }}>{formatTime(audioState.duration)}</span>
                                            <button
                                                onClick={handleCycleSpeed}
                                                style={{
                                                    background: 'rgba(255,255,255,0.10)',
                                                    border: '1px solid rgba(255,255,255,0.18)',
                                                    color: 'white',
                                                    fontSize: 14,
                                                    borderRadius: 8,
                                                    padding: '4px 10px',
                                                    marginLeft: 6,
                                                    cursor: 'pointer',
                                                    minWidth: 36
                                                }}
                                                title="Change playback speed"
                                            >
                                                {playbackSpeed}x
                                            </button>
                                            <audio
                                                ref={audioRef}
                                                src={data.audioURL}
                                                onTimeUpdate={handleTimeUpdate}
                                                onLoadedMetadata={handleLoadedMetadata}
                                                onPlay={() => setAudioState((s) => ({ ...s, playing: true }))}
                                                onPause={() => setAudioState((s) => ({ ...s, playing: false }))}
                                                style={{ display: 'none' }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Blog Content */}
            <div className="py-16 px-[158px] max-md:p-8 text-justify">
                <div 
                    className="whitespace-pre-wrap max-w-none"
                    style={{
                        color: 'black',
                        fontSize: '20px',
                        fontFamily: 'SF Pro Display',
                        fontWeight: '400',
                        lineHeight: '36px',
                        wordWrap: 'break-word'
                    }}
                >
                    {data?.fullText ? (
                        <Markdown
                            components={{
                                p: ({children}) => (
                                    <p style={{
                                        color: 'black',
                                        fontSize: '20px',
                                        fontFamily: 'SF Pro Display',
                                        fontWeight: '400',
                                        lineHeight: '36px',
                                        wordWrap: 'break-word',
                                        marginBottom: '20px'
                                    }}>
                                        {children}
                                    </p>
                                ),
                                h1: ({children}) => (
                                    <h1 style={{
                                        color: 'black',
                                        fontSize: '32px',
                                        fontFamily: 'SF Pro Display',
                                        fontWeight: '600',
                                        lineHeight: '40px',
                                        marginBottom: '24px',
                                        marginTop: '32px'
                                    }}>
                                        {children}
                                    </h1>
                                ),
                                h2: ({children}) => (
                                    <h2 style={{
                                        color: 'black',
                                        fontSize: '28px',
                                        fontFamily: 'SF Pro Display',
                                        fontWeight: '600',
                                        lineHeight: '36px',
                                        marginBottom: '20px',
                                        marginTop: '28px'
                                    }}>
                                        {children}
                                    </h2>
                                ),
                                h3: ({children}) => (
                                    <h3 style={{
                                        color: 'black',
                                        fontSize: '24px',
                                        fontFamily: 'SF Pro Display',
                                        fontWeight: '600',
                                        lineHeight: '32px',
                                        marginBottom: '16px',
                                        marginTop: '24px'
                                    }}>
                                        {children}
                                    </h3>
                                ),
                                strong: ({children}) => (
                                    <strong style={{
                                        color: 'black',
                                        fontWeight: '600'
                                    }}>
                                        {children}
                                    </strong>
                                )
                            }}
                        >
                            {formatData(data.fullText)}
                        </Markdown>
                    ) : (
                        <div className="text-gray-500 text-center py-10">
                            No content available for this blog post.
                        </div>
                    )}
                </div>
            </div>

            {/* Related Articles */}
            {blogs && blogs.length > 0 && (
                <div className="py-5 bg-gray-50">
                    <div 
                        className="text-[64px] self-center max-sm:text-[36px] px-16 max-md:px-8 text-center mb-8 text-gray-900"
                        style={{
                            fontFamily: '"Gelica", sans-serif',
                            fontWeight: 400,
                        }}
                    >
                        Related Articles
                    </div>
                    <div className="flex gap-7 items-center justify-center w-full overflow-x-auto overflow-y-hidden noScroll px-16 max-md:px-8">
                        {blogs
                            ?.filter((item: any) => item.id !== id)
                            .slice(0, 3)
                            .map((e: any) => (
                                <Link 
                                    to={`/blog/${e.id}?type=${type}`} 
                                    className="h-[344px] min-w-[400px] max-w-[400px] flex-shrink-0 bg-white rounded-3xl shadow-lg hover:scale-105 transition-transform duration-300"
                                    key={e.id}
                                >
                                    <img 
                                        className="h-[268px] w-full object-cover rounded-t-3xl" 
                                        src={e?.teaserImageURL || "/blog-1.jpg"} 
                                        onError={(event) => {
                                            (event.target as HTMLImageElement).src = "/blog-1.jpg";
                                        }}
                                    />
                                    <div className="text-left w-full bg-cover p-[5%] font-medium text-sm">
                                        <div className="font-semibold mb-2">
                                            {e?.primaryTitle.length > 60 
                                                ? `${e?.primaryTitle.slice(0, 60)}...` 
                                                : e?.primaryTitle}
                                        </div>
                                        <div className="text-gray-600 text-xs">
                                            {e?.multiMediaType !== "spinnedAudio" ? e?.originalAuthorName : "Dhyan App"}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                    </div>
                </div>
            )}

            {/* Back to Top Button */}
            {showBackToTop && (
                <div className="flex justify-center py-8">
                    <button
                        onClick={scrollToTop}
                        className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 
                                 flex items-center justify-center text-gray-800 
                                 transition-all duration-300 hover:bg-white/20 hover:border-white/30 
                                 hover:scale-110 shadow-lg hover:shadow-xl
                                 bg-gradient-to-r from-white/15 to-white/5"
                        aria-label="Back to top"
                    >
                        <svg 
                            className="w-6 h-6" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M5 10l7-7m0 0l7 7m-7-7v18" 
                            />
                        </svg>
                    </button>
                </div>
            )}

            {/* Footer */}
            <div className="relative z-20">
                <Footer />
            </div>
        </div>
    );
}

export default BlogPage; 