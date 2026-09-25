/**
 * Níveis e séries de ensino suportados pelo sistema.
 * Fonte única de verdade para todos os dropdowns e filtros.
 */

export const EDUCATION_LEVELS = [
  // Educação Infantil
  { value: 'Berçário', label: 'Berçário', group: 'Educação Infantil' },
  { value: 'Maternal I', label: 'Maternal I', group: 'Educação Infantil' },
  { value: 'Maternal II', label: 'Maternal II', group: 'Educação Infantil' },
  { value: 'Pré I', label: 'Pré I', group: 'Educação Infantil' },
  { value: 'Pré II', label: 'Pré II', group: 'Educação Infantil' },

  // Ensino Fundamental I
  { value: '1º Ano', label: '1º Ano', group: 'Fund. I (1-5)' },
  { value: '2º Ano', label: '2º Ano', group: 'Fund. I (1-5)' },
  { value: '3º Ano', label: '3º Ano', group: 'Fund. I (1-5)' },
  { value: '4º Ano', label: '4º Ano', group: 'Fund. I (1-5)' },
  { value: '5º Ano', label: '5º Ano', group: 'Fund. I (1-5)' },

  // Ensino Fundamental II
  { value: '6º Ano', label: '6º Ano', group: 'Fund. II (6-9)' },
  { value: '7º Ano', label: '7º Ano', group: 'Fund. II (6-9)' },
  { value: '8º Ano', label: '8º Ano', group: 'Fund. II (6-9)' },
  { value: '9º Ano', label: '9º Ano', group: 'Fund. II (6-9)' },

  // Ensino Médio
  { value: '1º EM', label: '1º Ano EM', group: 'Ensino Médio' },
  { value: '2º EM', label: '2º Ano EM', group: 'Ensino Médio' },
  { value: '3º EM', label: '3º Ano EM', group: 'Ensino Médio' },

  // Ensino Técnico
  { value: 'Técnico 1º Módulo', label: '1º Módulo', group: 'Técnico' },
  { value: 'Técnico 2º Módulo', label: '2º Módulo', group: 'Técnico' },
  { value: 'Técnico 3º Módulo', label: '3º Módulo', group: 'Técnico' },
  { value: 'Técnico 4º Módulo', label: '4º Módulo', group: 'Técnico' },

  // Graduação
  { value: 'Graduação 1º Semestre', label: '1º Semestre', group: 'Graduação' },
  { value: 'Graduação 2º Semestre', label: '2º Semestre', group: 'Graduação' },
  { value: 'Graduação 3º Semestre', label: '3º Semestre', group: 'Graduação' },
  { value: 'Graduação 4º Semestre', label: '4º Semestre', group: 'Graduação' },
  { value: 'Graduação 5º Semestre', label: '5º Semestre', group: 'Graduação' },
  { value: 'Graduação 6º Semestre', label: '6º Semestre', group: 'Graduação' },
  { value: 'Graduação 7º Semestre', label: '7º Semestre', group: 'Graduação' },
  { value: 'Graduação 8º Semestre', label: '8º Semestre', group: 'Graduação' },
  { value: 'Graduação 9º Semestre', label: '9º Semestre', group: 'Graduação' },
  { value: 'Graduação 10º Semestre', label: '10º Semestre', group: 'Graduação' },

  // Pós-Graduação
  { value: 'Especialização', label: 'Especialização', group: 'Pós-Graduação' },
  { value: 'MBA', label: 'MBA', group: 'Pós-Graduação' },
  { value: 'Mestrado', label: 'Mestrado', group: 'Pós-Graduação' },
  { value: 'Doutorado', label: 'Doutorado', group: 'Pós-Graduação' },
  { value: 'Pós-Doutorado', label: 'Pós-Doutorado', group: 'Pós-Graduação' },
];

/** Grupos únicos de ensino */
export const EDUCATION_GROUPS = [...new Set(EDUCATION_LEVELS.map((l) => l.group))];

/** Mapa rápido: value → label */
export const LEVEL_LABEL = Object.fromEntries(EDUCATION_LEVELS.map((l) => [l.value, l.label]));

/** Mapa rápido: value → group */
export const LEVEL_GROUP = Object.fromEntries(EDUCATION_LEVELS.map((l) => [l.value, l.group]));

/**
 * Componente utilitário de seleção de nível/série agrupado.
 * Uso: <GradeLevelSelect value={...} onValueChange={...} includeAll />
 */
import React from 'react';
import {
  Select, SelectContent, SelectGroup, SelectItem,
  SelectLabel, SelectTrigger, SelectValue,
} from '@/components/ui/select';

export function GradeLevelSelect({ value, onValueChange, includeAll = false, placeholder = 'Série / Nível', className }) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="max-h-[340px]">
        {includeAll && <SelectItem value="all">Todos os níveis</SelectItem>}
        {EDUCATION_GROUPS.map((group) => (
          <SelectGroup key={group}>
            <SelectLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">{group}</SelectLabel>
            {EDUCATION_LEVELS.filter((l) => l.group === group).map((l) => (
              <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}