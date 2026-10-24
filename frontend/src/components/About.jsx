const About = () => {
  return (
    <section id="a-propos" className="py-20">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" data-aos="fade-up">
          À <span className="gradient-text">propos</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-12">
          <div data-aos="fade-right">
            <h3 className="text-2xl font-semibold mb-4">Qui suis-je ?</h3>
            {/* 👇 MODIFIEZ VOTRE DESCRIPTION */}
            <p className="text-gray-300 leading-relaxed">
              Je suis un étudiant en 2ᵉ année de développement web et systèmes réseaux, 
              passionné par les nouvelles technologies et la création de solutions innovantes.
            </p>
            {/* 👇 MODIFIEZ VOTRE DESCRIPTION */}
            <p className="text-gray-300 leading-relaxed mt-4">
              Mon parcours m'a permis d'acquérir une double compétence unique : 
              le <span className="text-secondary font-semibold">développement full-stack</span> 
              et l'<span className="text-secondary font-semibold">administration réseau</span>.
            </p>
            <div className="flex gap-4 mt-6">
              <span className="bg-primary/20 text-primary px-4 py-1 rounded-full text-sm">Dev Web</span>
              <span className="bg-accent/20 text-accent px-4 py-1 rounded-full text-sm">Réseaux</span>
              <span className="bg-secondary/20 text-secondary px-4 py-1 rounded-full text-sm">Embarqué</span>
            </div>
          </div>

          <div data-aos="fade-left" className="space-y-4">
            <h3 className="text-2xl font-semibold mb-4">Parcours</h3>
            {/* 👇 MODIFIEZ VOTRE PARCOURS */}
            <div className="glass p-4 rounded-xl">
              <p className="text-secondary font-bold">2024 - Aujourd'hui</p>
              <p className="text-white font-semibold">L2 - Développement Web & Réseaux</p>
              <p className="text-gray-400 text-sm">React, C#, Java, PHP, SQL</p>
            </div>
            {/* 👇 MODIFIEZ VOTRE PARCOURS */}
            <div className="glass p-4 rounded-xl">
              <p className="text-secondary font-bold">2023 - 2024</p>
              <p className="text-white font-semibold">L1 - Informatique & Réseaux</p>
              <p className="text-gray-400 text-sm">HTML, CSS, JS, Systèmes embarqués, MSI</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;