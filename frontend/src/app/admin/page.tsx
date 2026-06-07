export default function AdminPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold font-headline text-brand-black dark:text-brand-white">Visão Geral</h1>
      <p className="text-brand-gray text-lg">Bem-vinda ao Painel de Controle (Git-Backed CMS).</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <div className="p-6 bg-brand-gold/10 border border-brand-gold/30 rounded-2xl">
          <h3 className="font-bold text-xl text-brand-gold mb-2">Lições & Cursos</h3>
          <p className="text-brand-gray mb-4">Gerencie a estrutura da metodologia de ensino.</p>
        </div>
        
        <div className="p-6 bg-[#2D8A5C]/10 border border-[#2D8A5C]/30 rounded-2xl">
          <h3 className="font-bold text-xl text-[#2D8A5C] mb-2">Artigos</h3>
          <p className="text-brand-gray mb-4">Escreva artigos com suporte a Markdown e Imagens.</p>
        </div>
      </div>
    </div>
  );
}
