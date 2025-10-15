import { Chart } from 'chart.js';

// Plugin genérico que muestra un mensaje cuando no hay datos
export const NoDataPlugin = {
  id: 'noDataPlugin',
  afterDraw: (chart: any) => {
    const datasets = chart.data.datasets;
    const hasData = datasets.some((ds: any) => ds.data.some((v: number) => v > 0));

    if (!hasData) {
      const ctx = chart.ctx;
      const { width, height } = chart;

      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#999'; // color gris del texto
      ctx.font = '16px Arial';
      ctx.fillText('Sin datos disponibles', width / 2, height / 2);
      ctx.restore();
    }
  }
};

// Registrar el plugin globalmente
Chart.register(NoDataPlugin);
