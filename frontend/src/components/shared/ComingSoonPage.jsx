import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import PageHeader from './PageHeader';

export default function ComingSoonPage({ title, subtitle, icon, features = [] }) {
  return (
    <div>
      <PageHeader title={title} subtitle={subtitle} icon={icon} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-3xl p-10 md:p-16 premium-shadow text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] via-transparent to-accent/[0.03] pointer-events-none" />
        <div className="relative">
          <div className="w-16 h-16 mx-auto rounded-2xl gradient-gold flex items-center justify-center mb-5 shadow-lg">
            <Sparkles className="w-7 h-7 text-primary" />
          </div>
          <h2 className="font-serif text-3xl font-bold mb-2">Módulo em desenvolvimento</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            Esta área está sendo finalizada e estará disponível em breve com todas as funcionalidades.
          </p>
          {features.length > 0 && (
            <div className="grid md:grid-cols-3 gap-3 max-w-3xl mx-auto">
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  className="bg-muted/40 border border-border rounded-xl p-4 text-left"
                >
                  <div className="text-xs font-semibold text-primary mb-1">✓ {f.title}</div>
                  <div className="text-xs text-muted-foreground">{f.desc}</div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}