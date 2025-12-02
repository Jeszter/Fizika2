import React from 'react'

const AnimatedBackground = () => {
    return (
        <>
            {/* Fixed background that covers entire viewport */}
            <div className="fixed inset-0 -z-50 overflow-hidden">
                {/* Main gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary-blue-bg/30 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900/20"></div>

                {/* Animated gradient orbs */}
                <div className="absolute top-0 left-0 w-full h-full opacity-20 dark:opacity-30">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-blue rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
                    <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
                </div>

                {/* Grid pattern */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0aDJ2LTJoLTJ6TTM0IDM2aC0ydjJoMnptMiAySDM0djJoMnptLTIgMmgtMnYyaDJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-10 dark:opacity-5"></div>

                {/* Floating shapes */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute w-64 h-64 -top-32 -left-32 bg-primary-blue/10 dark:bg-blue-500/10 rounded-full animate-spin-slow"></div>
                    <div className="absolute w-48 h-48 bottom-32 right-32 bg-purple-500/10 dark:bg-purple-500/10 rounded-full animate-spin-slow" style={{animationDirection: 'reverse', animationDuration: '40s'}}></div>

                    {/* Small floating dots */}
                    <div className="absolute w-2 h-2 top-1/4 left-1/3 bg-primary-blue/30 dark:bg-blue-400/30 rounded-full animate-float" style={{animationDelay: '0s'}}></div>
                    <div className="absolute w-3 h-3 top-1/3 right-1/4 bg-primary-blue/40 dark:bg-blue-400/40 rounded-full animate-float" style={{animationDelay: '2s', animationDuration: '25s'}}></div>
                    <div className="absolute w-4 h-4 bottom-1/4 left-1/4 bg-primary-blue/20 dark:bg-blue-400/20 rounded-full animate-float" style={{animationDelay: '4s', animationDuration: '30s'}}></div>
                    <div className="absolute w-2 h-2 bottom-1/3 right-1/3 bg-primary-blue/50 dark:bg-blue-400/50 rounded-full animate-float" style={{animationDelay: '6s', animationDuration: '20s'}}></div>
                </div>
            </div>

            {/* Add these animations to tailwind.config.js */}
            <style jsx>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 60s linear infinite;
                }
                @keyframes float {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    33% { transform: translate(30px, -50px) rotate(120deg); }
                    66% { transform: translate(-20px, 20px) rotate(240deg); }
                }
                .animate-float {
                    animation: float 20s infinite linear;
                }
            `}</style>
        </>
    )
}

export default AnimatedBackground