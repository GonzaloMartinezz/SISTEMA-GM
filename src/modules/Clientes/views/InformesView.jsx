// ============================================================================
// SISTEMA GM · M-01 CLIENTES · INFORMES Y ESTADÍSTICAS
// ----------------------------------------------------------------------------
// Análisis de la cartera: tamaño y composición, evolución de altas, reparto por
// rubro, estado comercial y concentración geográfica. Todos los números salen
// de las mismas fuentes que las demás secciones; acá no se calcula nada aparte.
// ============================================================================

import React, { useMemo } from 'react';
import { Building2, DollarSign, Repeat, Users } from 'lucide-react';
import { useClientes } from '../context/ClientesContext';
import Panel from '../../../shared/gm-ui/Panel';
import TarjetaKpi from '../../../shared/gm-ui/TarjetaKpi';
import { usd } from '../../../shared/gm-ui/graficos';
import GraficoCarteraRubro from '../components/informes/GraficoCarteraRubro';
import GraficoAltas from '../components/informes/GraficoAltas';
import EstadoCartera from '../components/informes/EstadoCartera';
import RankingLocalidades from '../components/informes/RankingLocalidades';

export default function InformesView() {
  const { clientes, leads, mensajes, cargando } = useClientes();

  const kpis = useMemo(() => {
    const activos = clientes.filter((c) => c.estado === 'activo').length;
    const cartera = leads.reduce((s, l) => s + Number(l.montoUsd || 0), 0);
    const ticket = leads.length ? cartera / leads.length : 0;
    const esteMes = new Date().toISOString().slice(0, 7);
    const altasMes = clientes.filter((c) => String(c.cliente_desde || '').startsWith(esteMes)).length;
    const contactosMes = mensajes.filter((m) => String(m.fecha || '').startsWith(esteMes)).length;

    return {
      total: clientes.length,
      activos,
      penetracion: clientes.length ? Math.round((activos / clientes.length) * 100) : 0,
      cartera,
      ticket,
      altasMes,
      contactosMes,
    };
  }, [clientes, leads, mensajes]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <TarjetaKpi
          etiqueta="Cuentas en cartera"
          valor={kpis.total}
          detalle={`${kpis.activos} activas · ${kpis.penetracion}% del padrón`}
          icono={Users}
          tono="naranja"
        />
        <TarjetaKpi
          etiqueta="Altas del mes"
          valor={kpis.altasMes}
          detalle="cuentas nuevas incorporadas"
          icono={Building2}
          tono="azul"
          tendencia={kpis.altasMes > 0 ? 'sube' : 'igual'}
        />
        <TarjetaKpi
          etiqueta="Cartera en oportunidades"
          valor={usd(kpis.cartera)}
          detalle={`ticket promedio ${usd(kpis.ticket)}`}
          icono={DollarSign}
          tono="naranja"
        />
        <TarjetaKpi
          etiqueta="Contactos del mes"
          valor={kpis.contactosMes}
          detalle="mensajes enviados y recibidos"
          icono={Repeat}
          tono="azul"
        />
      </div>

      <Panel
        titulo="Evolución de la cartera"
        bajada="Altas mes a mes y crecimiento acumulado de los últimos 12 meses."
      >
        {cargando ? (
          <p className="py-10 text-center text-[14px] text-[var(--gm-texto-medio)]">Calculando…</p>
        ) : (
          <GraficoAltas clientes={clientes} />
        )}
      </Panel>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Panel titulo="Clientes por rubro" bajada="Distribución del padrón entre las tres especialidades.">
          <GraficoCarteraRubro clientes={clientes} />
        </Panel>

        <Panel titulo="Estado comercial" bajada="Composición de la cartera entre activos, leads e inactivos.">
          <EstadoCartera clientes={clientes} />
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Panel titulo="Concentración geográfica" bajada="Las localidades con más cuentas cargadas.">
          <RankingLocalidades clientes={clientes} />
        </Panel>

        <Panel titulo="Clasificación de cuentas" bajada="Reparto entre Premium, Estándar e Inicial.">
          <EstadoCartera clientes={clientes} campo="clasificacion" />
        </Panel>
      </div>
    </div>
  );
}
