import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import StatCard from './components/StatCard';
import ErrorCard from './components/ErrorCard';
import ConformityChart from './components/ConformityChart';
import TimelinePhase from './components/TimelinePhase';
import MCDComparator from './components/MCDComparator';
import { auditData } from './data/auditData';
import { Download, Printer, Calendar } from 'lucide-react';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('synthese');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleExportPDF = () => {
    // Créer un élément temporaire avec tout le contenu
    const printContent = document.querySelector('main').cloneNode(true);
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Rapport Audit MCD - Export PDF</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; background: white; color: #000; }
            h1, h2, h3 { margin-bottom: 16px; color: #000; }
            .glass-effect, .border { border: 1px solid #ddd !important; background: white !important; }
            button { display: none; }
            .hidden { display: none !important; }
            @media print {
              body { padding: 20px; }
              .no-print { display: none !important; }
            }
          </style>
        </head>
        <body>
          <h1>Rapport d'Audit MCD/MLD - Bibliothèque Universitaire</h1>
          <p style="margin-bottom: 30px; color: #666;">Date: 5 décembre 2025</p>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const handlePrint = () => {
    window.print();
  };

  // Ajouter des styles d'impression
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @media print {
        .no-print, aside, .glass-effect-sidebar { display: none !important; }
        main { margin: 0 !important; padding: 20px !important; }
        .glass-effect { background: white !important; border: 1px solid #ddd !important; }
        * { color: black !important; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const renderContent = () => {
    switch(activeTab) {
      case 'synthese':
        return <SyntheseView />;
      case 'erreurs':
        return <ErreursView />;
      case 'analyse':
        return <AnalyseView />;
      case 'plan':
        return <PlanActionView />;
      case 'sql':
        return <SQLView />;
      case 'criteres':
        return <CriteresView />;
      case 'modele':
        return <ModeleView />;
      default:
        return <SyntheseView />;
    }
  };

  return (
    <div className="flex min-h-screen bg-dark-200">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-20 glass-effect border-b border-white/10 backdrop-blur-xl">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="header-fade-in">
                <h1 className="text-2xl font-bold text-white mb-1">
                  Rapport d'Audit MCD/MLD
                </h1>
                <div className="flex items-center gap-3 text-sm">
                  <div 
                    className="px-4 py-1.5 rounded-lg font-mono font-semibold transition-all duration-300"
                    style={{
                      backgroundColor: 'transparent',
                      border: '1px solid rgba(229, 231, 235, 0.5)',
                      color: 'rgb(229, 231, 235)',
                      boxShadow: '0 0 15px rgba(229, 231, 235, 0.3), inset 0 0 10px rgba(229, 231, 235, 0.08)'
                    }}
                  >
                    {currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </div>
                  <span className="w-1 h-1 rounded-full bg-platinum-400"></span>
                  <span className="text-platinum-400">5 décembre 2025</span>
                  <span className="w-1 h-1 rounded-full bg-platinum-400"></span>
                  <span className="status-badge-animated">🔴 Action Requise</span>
                </div>
              </div>
              
              <div className="flex gap-3 header-fade-in" style={{animationDelay: '0.1s'}}>
                <button 
                  onClick={() => handleExportPDF()}
                  className="px-4 py-2 rounded-lg glass-effect hover:bg-emerald-500/20 transition-all duration-300 flex items-center gap-2 text-platinum-300 hover:text-emerald-400 hover:scale-105 border border-emerald-500/30"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Export PDF</span>
                </button>
                <button 
                  onClick={() => handlePrint()}
                  className="px-4 py-2 rounded-lg glass-effect hover:bg-ruby-500/20 transition-all duration-300 flex items-center gap-2 text-platinum-300 hover:text-ruby-400 hover:scale-105 border border-ruby-500/30"
                >
                  <Printer className="w-4 h-4" />
                  <span className="hidden sm:inline">Imprimer</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8 content-fade-in">
          {renderContent()}
        </div>

        {/* Footer - Legal Mentions */}
        <footer className="mt-12 border-t border-white/10 glass-effect">
          <div className="px-8 py-6 text-center">
            <p className="text-platinum-400 text-sm mb-2">
              Rapport d'Audit MCD/MLD - Bibliothèque Universitaire
            </p>
            <p className="text-platinum-500 text-xs mb-3">
              Auteur: <span className="text-emerald-400 font-semibold">Fares Chehidi</span> • Décembre 2025
            </p>
            <p className="text-platinum-600 text-xs">
              Document confidentiel - Usage strictement interne • Tous droits réservés
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}

// ==================== VIEWS ====================

function SyntheseView() {
  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {auditData.stats.map((stat, i) => (
          <div key={i} className="stagger-item">
            <StatCard {...stat} />
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Erreurs Critiques */}
        <div className="glass-effect rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="text-ruby-500">🔴</span>
            Top 5 Erreurs Critiques
          </h2>
          <div className="space-y-4">
            {auditData.erreursCritiques.slice(0, 5).map((erreur, i) => (
              <ErrorCard key={i} erreur={erreur} />
            ))}
          </div>
        </div>

        {/* Conformity Chart */}
        <ConformityChart data={auditData.conformiteData} />
      </div>

      {/* SQL Stats */}
      <div className="glass-effect rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">Implémentation SQL</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(auditData.sqlImplementation).map(([key, value]) => (
            <div key={key} className="text-center p-4 rounded-xl" style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
              <p className="text-3xl font-bold text-emerald-500 mb-1">{value}</p>
              <p className="text-sm text-platinum-400 capitalize">{key}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ErreursView() {
  return (
    <div className="space-y-8">
      <div className="glass-effect rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Catalogue des Erreurs</h2>
          <div className="flex gap-4">
            <div className="px-4 py-2 rounded-lg bg-ruby-500/20 border border-ruby-500/30">
              <span className="text-ruby-500 font-bold">11</span>
              <span className="text-platinum-400 text-sm ml-2">Critiques</span>
            </div>
            <div className="px-4 py-2 rounded-lg bg-orange-500/20 border border-orange-500/30">
              <span className="text-orange-500 font-bold">7</span>
              <span className="text-platinum-400 text-sm ml-2">Majeures</span>
            </div>
          </div>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-6">
          {auditData.erreursCritiques.map((erreur, i) => (
            <ErrorCard key={i} erreur={erreur} />
          ))}
        </div>
      </div>
    </div>
  );
}

function AnalyseView() {
  return (
    <div className="space-y-8">
      <ConformityChart data={auditData.conformiteData} />
      
      <div className="glass-effect rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">Analyse Détaillée</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-4 px-4 text-platinum-300 font-semibold">Critère</th>
                <th className="text-center py-4 px-4 text-platinum-300 font-semibold">MCD Client</th>
                <th className="text-center py-4 px-4 text-platinum-300 font-semibold">MCD Corrigé</th>
                <th className="text-center py-4 px-4 text-platinum-300 font-semibold">Amélioration</th>
              </tr>
            </thead>
            <tbody>
              {auditData.conformiteData.map((row, i) => (
                <tr key={i} className="border-b border-white/5 transition-colors hover:bg-white/5">
                  <td className="py-4 px-4 text-white font-medium">{row.critere}</td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-ruby-500 font-bold">{row.client}/{row.max}</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-emerald-500 font-bold">{row.corrige}/{row.max}</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-yellow-500 font-bold">
                      +{Math.round(((row.corrige - row.client) / row.max) * 100)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PlanActionView() {
  return (
    <div className="space-y-8">
      <div className="glass-effect rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-white mb-2">Plan d'Action</h2>
        <p className="text-platinum-400 mb-6">Durée totale estimée: <span className="text-emerald-500 font-bold">17-22 jours</span></p>
        
        <div className="space-y-6">
          {auditData.planAction.map((phase, i) => (
            <TimelinePhase key={i} phase={phase} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SQLView() {
  return (
    <div className="space-y-8">
      <div className="glass-effect rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Implémentation SQL</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {Object.entries(auditData.sqlImplementation).map(([key, value]) => (
            <div key={key} className="text-center p-6 rounded-xl border border-white/10" style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
              <p className="text-4xl font-bold text-emerald-500 mb-2">{value}</p>
              <p className="text-sm text-platinum-400 capitalize">{key}</p>
            </div>
          ))}
        </div>

        <div className="bg-dark-100 rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-bold text-white mb-4">Exemple: Table LIVRE</h3>
          <pre className="text-sm text-platinum-300 overflow-x-auto">
            <code>{`CREATE TABLE LIVRE (
    ISBN            VARCHAR(13) PRIMARY KEY,
    titre           VARCHAR(300) NOT NULL,
    resume          TEXT,
    datePublication DATE,
    langue          VARCHAR(50) DEFAULT 'Français',
    nbPages         INT,
    codeEditeur     VARCHAR(20) NOT NULL,
    
    CONSTRAINT fk_livre_editeur 
        FOREIGN KEY (codeEditeur) 
        REFERENCES EDITEUR(codeEditeur)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    
    CONSTRAINT chk_livre_isbn 
        CHECK (LENGTH(ISBN) IN (10, 13)),
    CONSTRAINT chk_livre_pages 
        CHECK (nbPages > 0)
);

CREATE INDEX idx_livre_titre ON LIVRE(titre);
CREATE INDEX idx_livre_editeur ON LIVRE(codeEditeur);`}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}

function CriteresView() {
  return (
    <div className="glass-effect rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Classification des Critères</h2>
      <p className="text-platinum-400 mb-6">Analyse complète des fonctionnalités et critères du cahier des charges</p>
      
      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6">
        <p className="text-platinum-300">✅ Toutes les fonctionnalités du CDC sont validables avec le modèle corrigé</p>
      </div>
    </div>
  );
}

function ModeleView() {
  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="text-center p-6 glass-effect rounded-xl border border-ruby-500/20 card-hover">
          <p className="text-sm text-platinum-400 mb-2">MCD Client</p>
          <p className="text-4xl font-bold text-ruby-500">42%</p>
        </div>
        <div className="text-center p-6 glass-effect rounded-xl border border-emerald-500/20 card-hover">
          <p className="text-sm text-platinum-400 mb-2">MCD Corrigé</p>
          <p className="text-4xl font-bold text-emerald-500">100%</p>
        </div>
        <div className="text-center p-6 glass-effect rounded-xl border border-yellow-500/20 card-hover">
          <p className="text-sm text-platinum-400 mb-2">Amélioration</p>
          <p className="text-4xl font-bold text-yellow-500">+58%</p>
        </div>
      </div>

      {/* Comparateur MCD */}
      <MCDComparator />

      <div className="glass-effect rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">✅ Points Forts du Modèle Corrigé</h3>
        <ul className="space-y-3">
          {[
            'Identifiants stables (aucune dépendance aux données métier)',
            'Historisation complète (tous les événements traçables)',
            'Cardinalités réalistes (reflètent le monde physique)',
            'Toutes les requêtes fonctionnent (6/6 validées)',
            'Conformité 100% au cahier des charges',
            'Extensible et maintenable'
          ].map((point, i) => (
            <li key={i} className="flex items-start gap-3 text-platinum-300">
              <span className="text-emerald-500 text-xl">✓</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
