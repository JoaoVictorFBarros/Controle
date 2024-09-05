import React from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const GeneratePDF = () => {
  const generatePdfDocument = () => {
    const input = document.querySelector('.workspace');
    const downloadButton = document.querySelector('.downloadbutton');

    downloadButton.style.display = 'none';

    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 190;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 30;

        pdf.setFontSize(12);
        pdf.text('Centro Federal de Educação Tecnológica de Minas Gerais', 105, 22, null, null, 'center');

        pdf.setDrawColor(0);

        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight + 30;
          pdf.addPage();
          pdf.setDrawColor(0);
          pdf.setLineWidth(0.5); 
          pdf.rect(10, 10, 190, 275); 
          pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save('Dynsys.pdf');
      })
      .catch((err) => {
        console.error('Erro ao gerar PDF:', err);
      })
      .finally(() => {
        downloadButton.style.display = 'block';
      });
  };

  return (
<button
  tabIndex="0"
  onKeyDown={(e) => {
    if (e.key === 'Delete') {
      generatePdfDocument();
    }
  }}
  className='downloadbutton'
  onClick={generatePdfDocument}
>
  Download PDF
</button>

  );
};

export default GeneratePDF;
