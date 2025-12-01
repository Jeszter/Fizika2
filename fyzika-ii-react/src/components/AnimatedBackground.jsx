import React from 'react'

const AnimatedBackground = () => {
    return (
        <>
            {/* Animated Background - основной градиент */}
            <div className="fixed top-0 left-0 w-full h-full -z-20"
                 style={{
                     background: `
                        radial-gradient(circle at 20% 80%, rgba(37, 99, 235, 0.05) 0%, transparent 50%),
                        radial-gradient(circle at 80% 20%, rgba(37, 99, 235, 0.03) 0%, transparent 50%),
                        radial-gradient(circle at 40% 40%, rgba(37, 99, 235, 0.02) 0%, transparent 50%)
                     `
                 }}>
            </div>

            {/* Dark theme background */}
            <div className="dark:fixed dark:top-0 dark:left-0 dark:w-full dark:h-full dark:-z-20"
                 style={{
                     background: `
                        radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
                        radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
                        radial-gradient(circle at 40% 40%, rgba(59, 130, 246, 0.03) 0%, transparent 50%)
                     `
                 }}>
            </div>

            {/* Floating Shapes/Бульбашки - только круги */}
            <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none">
                {/* Большой круг (слева сверху) */}
                <div
                    className="absolute w-[200px] h-[200px] bg-primary-blue opacity-[0.03] dark:opacity-[0.05] rounded-full animate-float"
                    style={{
                        top: '10%',
                        left: '5%',
                    }}
                ></div>

                {/* Средний круг (справа посередине) */}
                <div
                    className="absolute w-[150px] h-[150px] bg-primary-blue opacity-[0.03] dark:opacity-[0.05] rounded-full animate-float"
                    style={{
                        top: '60%',
                        right: '10%',
                        animationDelay: '-5s'
                    }}
                ></div>

                {/* Маленький круг (слева снизу) */}
                <div
                    className="absolute w-[100px] h-[100px] bg-primary-blue opacity-[0.03] dark:opacity-[0.05] rounded-full animate-float"
                    style={{
                        bottom: '20%',
                        left: '20%',
                        animationDelay: '-10s'
                    }}
                ></div>

                {/* Дополнительные круги для большего разнообразия */}
                <div
                    className="absolute w-[120px] h-[120px] bg-primary-blue opacity-[0.02] dark:opacity-[0.04] rounded-full animate-float"
                    style={{
                        top: '30%',
                        right: '20%',
                        animationDelay: '-8s'
                    }}
                ></div>

                <div
                    className="absolute w-[80px] h-[80px] bg-primary-blue opacity-[0.02] dark:opacity-[0.04] rounded-full animate-float"
                    style={{
                        bottom: '40%',
                        right: '30%',
                        animationDelay: '-12s'
                    }}
                ></div>

                <div
                    className="absolute w-[90px] h-[90px] bg-primary-blue opacity-[0.02] dark:opacity-[0.04] rounded-full animate-float"
                    style={{
                        top: '15%',
                        right: '5%',
                        animationDelay: '-15s'
                    }}
                ></div>
            </div>
        </>
    )
}

export default AnimatedBackground