package com.habita40.project.service;

import com.habita40.project.dto.*;
import com.habita40.project.entity.*;
import com.habita40.project.repository.PlantaRepository;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.springframework.stereotype.Service;
import java.io.ByteArrayOutputStream;

@Service
public class PdfGenerationService {
    
    private static final float ESCALA = 0.5f;
    private static final float MARGEM = 50f;
    
    private final PlantaRepository plantaRepository;
    
    public PdfGenerationService(PlantaRepository plantaRepository) {
        this.plantaRepository = plantaRepository;
    }
    
    public byte[] gerarPlantaPdf(Long plantaId) throws Exception {
        PlantaEntity planta = plantaRepository.findById(plantaId)
            .orElseThrow(() -> new RuntimeException("Planta não encontrada"));
        
        return gerarPdf(planta);
    }
    
    public byte[] gerarPlantaPdfPorDados(PlantaResponseDTO planta) throws Exception {
        return gerarPdfDto(planta);
    }
    
    private byte[] gerarPdf(PlantaEntity planta) throws Exception {
        PDType1Font fontBold = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);
        PDType1Font fontRegular = new PDType1Font(Standard14Fonts.FontName.HELVETICA);
        
        try (PDDocument document = new PDDocument()) {
            PDRectangle pageSize = PDRectangle.A4;
            PDPage page = new PDPage(pageSize);
            document.addPage(page);
            
            try (PDPageContentStream content = new PDPageContentStream(document, page)) {
                float larguraPlanta = planta.getLarguraTotal().floatValue() * ESCALA;
                float comprimentoPlanta = planta.getComprimentoTotal().floatValue() * ESCALA;
                
                float centroX = (pageSize.getWidth() - larguraPlanta) / 2;
                float centroY = (pageSize.getHeight() - comprimentoPlanta) / 2;
                
                content.setStrokingColor(0f, 0f, 0f);
                content.setLineWidth(2f);
                content.addRect(centroX, centroY, larguraPlanta, comprimentoPlanta);
                content.stroke();
                
                content.setFont(fontBold, 14);
                content.beginText();
                content.newLineAtOffset(centroX, centroY + comprimentoPlanta + 20);
                content.showText("PLANTA HABITACIONAL - HIS");
                content.endText();
                
                content.setFont(fontRegular, 10);
                String infoText = String.format("%.2f m x %.2f m | Area Total: %.2f m2", 
                    planta.getLarguraTotal() / 100.0, planta.getComprimentoTotal() / 100.0, 
                    planta.getAreaTotal() / 10000.0);
                content.beginText();
                content.newLineAtOffset(centroX, centroY + comprimentoPlanta + 5);
                content.showText(infoText);
                content.endText();
                
                content.setFont(fontRegular, 8);
                
                for (ComodoEntity comodo : planta.getComodos()) {
                    float comodoX = centroX + getFloatValue(comodo.getPosicaoX()) * ESCALA;
                    float comodoY = centroY + getFloatValue(comodo.getPosicaoY()) * ESCALA;
                    float comodoLargura = comodo.getLargura().floatValue() * ESCALA;
                    float comodoComprimento = comodo.getComprimento().floatValue() * ESCALA;
                    
                    content.setLineWidth(1f);
                    content.addRect(comodoX, comodoY, comodoLargura, comodoComprimento);
                    content.stroke();
                    
                    content.beginText();
                    float textY = comodoY + comodoComprimento / 2 + 3;
                    content.newLineAtOffset(comodoX + 5, textY);
                    content.showText(comodo.getNome());
                    content.endText();
                    
                    String dimText = String.format("%.0f x %.0f", comodo.getLargura(), comodo.getComprimento());
                    content.beginText();
                    float dimY = comodoY + comodoComprimento / 2 - 8;
                    content.newLineAtOffset(comodoX + 5, dimY);
                    content.showText(dimText);
                    content.endText();
                    
                    double area = comodo.getLargura() * comodo.getComprimento() / 10000.0;
                    String areaText = String.format("%.2f m2", area);
                    content.beginText();
                    float areaY = comodoY + comodoComprimento / 2 - 18;
                    content.newLineAtOffset(comodoX + 5, areaY);
                    content.showText(areaText);
                    content.endText();
                }
                
                content.setFont(fontRegular, 9);
                content.beginText();
                content.newLineAtOffset(MARGEM, 40);
                content.showText("Legenda dos Ambientes:");
                content.endText();
                
                int yLegenda = 28;
                int idx = 0;
                for (ComodoEntity comodo : planta.getComodos()) {
                    double area = comodo.getLargura() * comodo.getComprimento() / 10000.0;
                    String legendText = String.format("- %s: %.0f x %.0f cm (%.2f m2)", 
                        comodo.getNome(), comodo.getLargura(), comodo.getComprimento(), area);
                    content.beginText();
                    content.newLineAtOffset(MARGEM, yLegenda - (idx * 12));
                    content.showText(legendText);
                    content.endText();
                    idx++;
                }
                
                double areaTotal = planta.getAreaTotal() / 10000.0;
                double areaConstruida = planta.getAreaConstruida() / 10000.0;
                String summaryText = String.format("Area Total: %.2f m2 | Area Construida: %.2f m2 | HIS %d", 
                    areaTotal, areaConstruida, planta.getAnoConstrucao());
                content.beginText();
                content.newLineAtOffset(pageSize.getWidth() - 280, 30);
                content.showText(summaryText);
                content.endText();
            }
            
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            document.save(out);
            return out.toByteArray();
        }
    }
    
    private byte[] gerarPdfDto(PlantaResponseDTO planta) throws Exception {
        PDType1Font fontBold = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);
        PDType1Font fontRegular = new PDType1Font(Standard14Fonts.FontName.HELVETICA);
        
        try (PDDocument document = new PDDocument()) {
            PDRectangle pageSize = PDRectangle.A4;
            PDPage page = new PDPage(pageSize);
            document.addPage(page);
            
            try (PDPageContentStream content = new PDPageContentStream(document, page)) {
                float larguraPlanta = planta.getLarguraTotal().floatValue() * ESCALA;
                float comprimentoPlanta = planta.getComprimentoTotal().floatValue() * ESCALA;
                
                float centroX = (pageSize.getWidth() - larguraPlanta) / 2;
                float centroY = (pageSize.getHeight() - comprimentoPlanta) / 2;
                
                content.setStrokingColor(0f, 0f, 0f);
                content.setLineWidth(2f);
                content.addRect(centroX, centroY, larguraPlanta, comprimentoPlanta);
                content.stroke();
                
                content.setFont(fontBold, 14);
                content.beginText();
                content.newLineAtOffset(centroX, centroY + comprimentoPlanta + 20);
                content.showText("PLANTA HABITACIONAL - HIS");
                content.endText();
                
                content.setFont(fontRegular, 10);
                String infoText = String.format("%.2f m x %.2f m | Area Total: %.2f m2 | Area Construida: %.2f m2", 
                    planta.getLarguraTotal() / 100.0, planta.getComprimentoTotal() / 100.0, 
                    planta.getAreaTotal(), planta.getAreaConstruida());
                content.beginText();
                content.newLineAtOffset(centroX, centroY + comprimentoPlanta + 5);
                content.showText(infoText);
                content.endText();
                
                content.setFont(fontRegular, 8);
                
                if (planta.getComodos() != null) {
                    for (ComodoDTO comodo : planta.getComodos()) {
                        float comodoX = centroX + getFloatValue(comodo.getPosicaoX()) * ESCALA;
                        float comodoY = centroY + getFloatValue(comodo.getPosicaoY()) * ESCALA;
                        float comodoLargura = comodo.getLargura().floatValue() * ESCALA;
                        float comodoComprimento = comodo.getComprimento().floatValue() * ESCALA;
                        
                        content.setLineWidth(1f);
                        content.addRect(comodoX, comodoY, comodoLargura, comodoComprimento);
                        content.stroke();
                        
                        content.beginText();
                        float textY = comodoY + comodoComprimento / 2 + 3;
                        content.newLineAtOffset(comodoX + 5, textY);
                        content.showText(comodo.getNome());
                        content.endText();
                        
                        String dimText = String.format("%.0f x %.0f", comodo.getLargura(), comodo.getComprimento());
                        content.beginText();
                        float dimY = comodoY + comodoComprimento / 2 - 8;
                        content.newLineAtOffset(comodoX + 5, dimY);
                        content.showText(dimText);
                        content.endText();
                        
                        double area = comodo.getLargura() * comodo.getComprimento() / 10000.0;
                        String areaText = String.format("%.2f m2", area);
                        content.beginText();
                        float areaY = comodoY + comodoComprimento / 2 - 18;
                        content.newLineAtOffset(comodoX + 5, areaY);
                        content.showText(areaText);
                        content.endText();
                    }
                }
                
                content.setFont(fontRegular, 9);
                content.beginText();
                content.newLineAtOffset(MARGEM, 40);
                content.showText("Legenda dos Ambientes:");
                content.endText();
                
                if (planta.getComodos() != null) {
                    int idx = 0;
                    for (ComodoDTO comodo : planta.getComodos()) {
                        double area = comodo.getLargura() * comodo.getComprimento() / 10000.0;
                        String legendText = String.format("- %s: %.0f x %.0f cm (%.2f m2)", 
                            comodo.getNome(), comodo.getLargura(), comodo.getComprimento(), area);
                        content.beginText();
                        content.newLineAtOffset(MARGEM, 28 - (idx * 12));
                        content.showText(legendText);
                        content.endText();
                        idx++;
                    }
                }
                
                String summaryText = String.format("Area Total: %.2f m2 | Area Construida: %.2f m2 | HIS %d", 
                    planta.getAreaTotal(), planta.getAreaConstruida(), planta.getAnoConstrucao());
                content.beginText();
                content.newLineAtOffset(pageSize.getWidth() - 280, 30);
                content.showText(summaryText);
                content.endText();
            }
            
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            document.save(out);
            return out.toByteArray();
        }
    }
    
    private float getFloatValue(Integer value) {
        return value != null ? value.floatValue() : 0f;
    }
}