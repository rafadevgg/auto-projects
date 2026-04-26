package com.habita40.project.controller;

import com.habita40.project.dto.*;
import com.habita40.project.service.PlantaService;
import com.habita40.project.service.PdfGenerationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/plantas")
@CrossOrigin(origins = "*")
public class PlantaController {
    
    private final PlantaService plantaService;
    private final PdfGenerationService pdfGenerationService;
    
    public PlantaController(PlantaService plantaService, PdfGenerationService pdfGenerationService) {
        this.plantaService = plantaService;
        this.pdfGenerationService = pdfGenerationService;
    }
    
    @PostMapping
    public ResponseEntity<PlantaResponseDTO> criarPlanta(@Valid @RequestBody PlantaRequestDTO request) {
        PlantaResponseDTO response = plantaService.criarPlanta(request);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/validar")
    public ResponseEntity<ValidacaoResultDTO> validarPlanta(@Valid @RequestBody PlantaRequestDTO request) {
        ValidacaoResultDTO result = plantaService.validarPlanta(request);
        return ResponseEntity.ok(result);
    }
    
    @PostMapping("/gerar-automatica")
    public ResponseEntity<PlantaResponseDTO> gerarPlantaAutomatica(@Valid @RequestBody PlantaRequestDTO request) {
        ValidacaoResultDTO validacao = plantaService.validarPlanta(request);
        
        if (!validacao.getValida()) {
            return ResponseEntity.badRequest().body(null);
        }
        
        PlantaResponseDTO response = plantaService.gerarPlantaAutomatica(request);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/{id}/comodos")
    public ResponseEntity<PlantaResponseDTO> adicionarComodos(
            @PathVariable Long id, 
            @Valid @RequestBody List<ComodoDTO> comodos) {
        PlantaResponseDTO response = plantaService.adicionarComodos(id, comodos);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping
    public ResponseEntity<List<PlantaResponseDTO>> listarPlantas() {
        List<PlantaResponseDTO> plantas = plantaService.listarPlantas();
        return ResponseEntity.ok(plantas);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<PlantaResponseDTO> buscarPlanta(@PathVariable Long id) {
        PlantaResponseDTO response = plantaService.buscarPlanta(id);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> gerarPdf(@PathVariable Long id) {
        try {
            byte[] pdf = pdfGenerationService.gerarPlantaPdf(id);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "planta-his-" + id + ".pdf");
            headers.setContentLength(pdf.length);
            
            return ResponseEntity.ok()
                .headers(headers)
                .body(pdf);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @PostMapping("/gerar-pdf")
    public ResponseEntity<byte[]> gerarPdfPorDados(@Valid @RequestBody PlantaResponseDTO planta) {
        try {
            byte[] pdf = pdfGenerationService.gerarPlantaPdfPorDados(planta);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "planta-his-" + planta.getId() + ".pdf");
            headers.setContentLength(pdf.length);
            
            return ResponseEntity.ok()
                .headers(headers)
                .body(pdf);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/modelos-basicos")
    public ResponseEntity<List<PlantaRequestDTO>> getModelosBasicos() {
        List<PlantaRequestDTO> modelos = List.of(
            criarModeloBasico1(),
            criarModeloBasico2(),
            criarModeloBasico3()
        );
        return ResponseEntity.ok(modelos);
    }
    
    private PlantaRequestDTO criarModeloBasico1() {
        PlantaRequestDTO modelo = new PlantaRequestDTO();
        modelo.setNome("Modelo HIS - 40m² (2 dormitórios)");
        modelo.setLarguraTotal(600.0);
        modelo.setComprimentoTotal(700.0);
        modelo.setAnoConstrucao(2026);
        
        modelo.setComodos(List.of(
            criarComodo("Sala/Estar", 300.0, 350.0),
            criarComodo("Cozinha", 200.0, 250.0),
            criarComodo("Dormitório 1", 280.0, 300.0),
            criarComodo("Dormitório 2", 280.0, 280.0),
            criarComodo("Banheiro", 200.0, 150.0)
        ));
        
        return modelo;
    }
    
    private PlantaRequestDTO criarModeloBasico2() {
        PlantaRequestDTO modelo = new PlantaRequestDTO();
        modelo.setNome("Modelo HIS - 45m² (3 dormitórios)");
        modelo.setLarguraTotal(700.0);
        modelo.setComprimentoTotal(700.0);
        modelo.setAnoConstrucao(2026);
        
        modelo.setComodos(List.of(
            criarComodo("Sala/Estar", 350.0, 350.0),
            criarComodo("Cozinha", 250.0, 250.0),
            criarComodo("Dormitório 1", 300.0, 300.0),
            criarComodo("Dormitório 2", 280.0, 280.0),
            criarComodo("Dormitório 3", 280.0, 280.0),
            criarComodo("Banheiro", 200.0, 150.0),
            criarComodo("Área de Serviço", 150.0, 150.0)
        ));
        
        return modelo;
    }
    
    private PlantaRequestDTO criarModeloBasico3() {
        PlantaRequestDTO modelo = new PlantaRequestDTO();
        modelo.setNome("Modelo HIS - 35m² (1 dormitório)");
        modelo.setLarguraTotal(550.0);
        modelo.setComprimentoTotal(650.0);
        modelo.setAnoConstrucao(2026);
        
        modelo.setComodos(List.of(
            criarComodo("Sala/Estar", 300.0, 300.0),
            criarComodo("Cozinha", 200.0, 250.0),
            criarComodo("Dormitório", 280.0, 300.0),
            criarComodo("Banheiro", 180.0, 150.0)
        ));
        
        return modelo;
    }
    
    private ComodoDTO criarComodo(String nome, Double largura, Double comprimento) {
        ComodoDTO comodo = new ComodoDTO();
        comodo.setNome(nome);
        comodo.setLargura(largura);
        comodo.setComprimento(comprimento);
        return comodo;
    }
}