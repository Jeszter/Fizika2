import React from 'react'

const FeaturesSection = () => {
    const features = [
        {
            icon: 'fa-bolt',
            title: 'Elektrostatika',
            description: 'Coulombov zákon, elektrické pole, potenciál a kapacita v prehľadnej forme'
        },
        {
            icon: 'fa-magnet',
            title: 'Magnetizmus',
            description: 'Magnetické polia, elektromagnetická indukcia a striedavé prúdy'
        },
        {
            icon: 'fa-lightbulb',
            title: 'Optika',
            description: 'Geometrická a vlnová optika, interferencia a difrakcia svetla'
        },
        {
            icon: 'fa-atom',
            title: 'Modernejšia fyzika',
            description: 'Špeciálna teória relativity a úvod do kvantovej fyziky'
        }
    ]

    return (
        <section className="py-24 px-8 bg-surface dark:bg-gray-800/50">
            <div className="text-center mb-16">
                <h2 className="text-5xl font-bold mb-4 text-text-dark dark:text-white">
                    Čo nájdete v kurze
                </h2>
                <p className="text-xl text-text-light dark:text-gray-300 max-w-3xl mx-auto">
                    Prehľadná štruktúra a kvalitné vzdelávacie materiály
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className="bg-white dark:bg-gray-800 p-10 rounded-custom-lg text-center shadow-custom dark:shadow-dark-custom border border-border dark:border-gray-700 transition-all duration-300 relative overflow-hidden hover:-translate-y-2 hover:shadow-custom-hover dark:hover:shadow-dark-custom-hover"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-primary-blue"></div>
                        <div className="w-20 h-20 bg-primary-blue rounded-2xl flex items-center justify-center mx-auto mb-6 text-white text-3xl transition-all duration-300 hover:scale-110">
                            <i className={`fas ${feature.icon}`}></i>
                        </div>
                        <h3 className="text-2xl font-bold mb-4 text-text-dark dark:text-white">
                            {feature.title}
                        </h3>
                        <p className="text-text-light dark:text-gray-300">
                            {feature.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default FeaturesSection