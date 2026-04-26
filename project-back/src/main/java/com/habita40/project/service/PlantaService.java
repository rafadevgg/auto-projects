package com.habita40.project.service;

import com.habita40.project.dto.*;
import com.habita40.project.entity.*;
import com.habita40.project.repository.PlantaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.List;

@Service
public class PlantaService {
    
    private static final double AREA_MAXIMA_HIS = 50.0;
    
    private final PlantaRepository plantaRepository;
    
    public PlantaService(PlantaRepository plantaRepository) {
        this.plantaRepository = plantaRepository;
    }
    
    @Transactional
    public PlantaResponseDTO criarPlanta(PlantaRequestDTO request) {
        PlantaEntity planta = new PlantaEntity();
        planta.setNome(request.getNome());
        planta.setLarguraTotal(request.getLarguraTotal());
        planta.setComprimentoTotal(request.getComprimentoTotal());
        planta.setAnoConstrucao(request.getAnoConstrucao());
        
        if (request.getComodos() != null && !request.getComodos().isEmpty()) {
            List<ComodoDTO> comodosOrdenados = ordenarComodos(request.getComodos());
            List<double[]> disposicoes = calcularDisposicaoOtima(
                request.getLarguraTotal(), 
                request.getComprimentoTotal(), 
                comodosOrdenados
            );
            
            int i = 0;
            for (ComodoDTO comodoDTO : comodosOrdenados) {
                ComodoEntity comodo = new ComodoEntity();
                comodo.setNome(comodoDTO.getNome());
                comodo.setLargura(comodoDTO.getLargura());
                comodo.setComprimento(comodoDTO.getComprimento());
                
                if (i < disposicoes.size()) {
                    comodo.setPosicaoX((int) disposicoes.get(i)[0]);
                    comodo.setPosicaoY((int) disposicoes.get(i)[1]);
                }
                
                planta.adicionarComodo(comodo);
                i++;
            }
        }
        
        planta = plantaRepository.save(planta);
        
        return converterParaResponse(planta);
    }
    
    @Transactional
    public PlantaResponseDTO adicionarComodos(Long plantaId, List<ComodoDTO> comodosDTO) {
        PlantaEntity planta = plantaRepository.findById(plantaId)
            .orElseThrow(() -> new RuntimeException("Planta não encontrada"));
        
        if (comodosDTO != null && !comodosDTO.isEmpty()) {
            List<ComodoDTO> comodosOrdenados = ordenarComodos(comodosDTO);
            List<double[]> disposicoes = calcularDisposicaoOtima(
                planta.getLarguraTotal(), 
                planta.getComprimentoTotal(), 
                comodosOrdenados
            );
            
            int i = 0;
            for (ComodoDTO comodoDTO : comodosOrdenados) {
                ComodoEntity comodo = new ComodoEntity();
                comodo.setNome(comodoDTO.getNome());
                comodo.setLargura(comodoDTO.getLargura());
                comodo.setComprimento(comodoDTO.getComprimento());
                
                if (i < disposicoes.size()) {
                    comodo.setPosicaoX((int) disposicoes.get(i)[0]);
                    comodo.setPosicaoY((int) disposicoes.get(i)[1]);
                }
                
                planta.adicionarComodo(comodo);
                i++;
            }
        }
        
        planta = plantaRepository.save(planta);
        
        return converterParaResponse(planta);
    }
    
    @Transactional
    public PlantaResponseDTO gerarPlantaAutomatica(PlantaRequestDTO request) {
        PlantaEntity planta = new PlantaEntity();
        planta.setNome(request.getNome());
        planta.setLarguraTotal(request.getLarguraTotal());
        planta.setComprimentoTotal(request.getComprimentoTotal());
        planta.setAnoConstrucao(request.getAnoConstrucao());
        
        planta = plantaRepository.save(planta);
        
        List<ComodoDTO> comodosOrdenados = ordenarComodos(request.getComodos());
        List<double[]> disposicoes = calcularDisposicaoOtima(
            request.getLarguraTotal(), 
            request.getComprimentoTotal(), 
            comodosOrdenados
        );
        
        int i = 0;
        for (ComodoDTO comodoDTO : comodosOrdenados) {
            ComodoEntity comodo = new ComodoEntity();
            comodo.setNome(comodoDTO.getNome());
            comodo.setLargura(comodoDTO.getLargura());
            comodo.setComprimento(comodoDTO.getComprimento());
            
            if (i < disposicoes.size()) {
                comodo.setPosicaoX((int) disposicoes.get(i)[0]);
                comodo.setPosicaoY((int) disposicoes.get(i)[1]);
            }
            
            planta.adicionarComodo(comodo);
            i++;
        }
        
        planta = plantaRepository.save(planta);
        
        return converterParaResponse(planta);
    }
    
    public List<ComodoDTO> ordenarComodos(List<ComodoDTO> comodos) {
        return comodos.stream()
            .sorted((c1, c2) -> Double.compare(c2.getArea(), c1.getArea()))
            .toList();
    }
    
    public List<double[]> calcularDisposicaoOtima(double larguraTotal, double comprimentoTotal, List<ComodoDTO> comodos) {
        List<double[]> posicoes = new ArrayList<>();
        
        double x = 0;
        double y = 0;
        double maiorLarguraLinha = 0;
        
        for (ComodoDTO comodo : comodos) {
            if (x + comodo.getLargura() > larguraTotal) {
                y += maiorLarguraLinha;
                x = 0;
                maiorLarguraLinha = 0;
            }
            
            if (y + comodo.getComprimento() > comprimentoTotal) {
                break;
            }
            
            posicoes.add(new double[]{x, y});
            x += comodo.getLargura();
            maiorLarguraLinha = Math.max(maiorLarguraLinha, comodo.getComprimento());
        }
        
        return posicoes;
    }
    
    public ValidacaoResultDTO validarPlanta(PlantaRequestDTO request) {
        ValidacaoResultDTO result = new ValidacaoResultDTO();
        List<String> erros = new ArrayList<>();
        
        double areaTotal = request.getLarguraTotal() * request.getComprimentoTotal() / 10000.0;
        
        if (areaTotal > AREA_MAXIMA_HIS) {
            erros.add(String.format(
                "Área total (%.2f m²) excede o limite máximo de %.2f m² para habitação de interesse social",
                areaTotal, AREA_MAXIMA_HIS
            ));
        }
        
        double areaConstruida = request.getComodos().stream()
            .mapToDouble(c -> (c.getLargura() * c.getComprimento()) / 10000.0)
            .sum();
        
        if (areaConstruida > AREA_MAXIMA_HIS) {
            erros.add(String.format(
                "Área construída (%.2f m²) excede o limite máximo de %.2f m²",
                areaConstruida, AREA_MAXIMA_HIS
            ));
        }
        
        if (request.getLarguraTotal() < 500 || request.getComprimentoTotal() < 500) {
            erros.add("Dimensões mínimas da planta devem ser 500 cm x 500 cm");
        }
        
        boolean temSala = false;
        boolean temQuarto = false;
        boolean temCozinha = false;
        boolean temBanheiro = false;
        
        for (ComodoDTO comodo : request.getComodos()) {
            String nome = comodo.getNome().toLowerCase();
            
            if (nome.contains("sala") || nome.contains("estar")) temSala = true;
            if (nome.contains("quarto") || nome.contains("dormitório")) temQuarto = true;
            if (nome.contains("cozinha")) temCozinha = true;
            if (nome.contains("banheiro") || nome.contains("sanitário")) temBanheiro = true;
        }
        
        if (!temSala) erros.add("É obrigatório至少 um ambiente de estar/sala");
        if (!temQuarto) erros.add("É obrigatório pelo menos um dormitório/quarto");
        if (!temCozinha) erros.add("É obrigatório uma cozinha");
        if (!temBanheiro) erros.add("É obrigatório pelo menos um banheiro");
        
        boolean valida = erros.isEmpty();
        result.setValida(valida);
        result.setMensagens(erros);
        
        if (valida) {
            result.getMensagens().add("Planta validada com sucesso para o programa HIS");
        }
        
        result.setAreaTotal(areaTotal);
        result.setAreaConstruida(areaConstruida);
        result.setAreaRestante(AREA_MAXIMA_HIS - areaConstruida);
        
        return result;
    }
    
    public PlantaResponseDTO buscarPlanta(Long id) {
        PlantaEntity planta = plantaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Planta não encontrada"));
        
        return converterParaResponse(planta);
    }
    
    public List<PlantaResponseDTO> listarPlantas() {
        return plantaRepository.findAll().stream()
            .map(this::converterParaResponse)
            .toList();
    }
    
    private PlantaResponseDTO converterParaResponse(PlantaEntity planta) {
        PlantaResponseDTO response = new PlantaResponseDTO();
        response.setId(planta.getId());
        response.setNome(planta.getNome());
        response.setLarguraTotal(planta.getLarguraTotal());
        response.setComprimentoTotal(planta.getComprimentoTotal());
        response.setAnoConstrucao(planta.getAnoConstrucao());
        
        double areaTotal = planta.getAreaTotal() / 10000.0;
        double areaConstruida = planta.getAreaConstruida() / 10000.0;
        
        response.setAreaTotal(areaTotal);
        response.setAreaConstruida(areaConstruida);
        
        List<ComodoDTO> comodosDTO = new ArrayList<>();
        for (ComodoEntity comodo : planta.getComodos()) {
            ComodoDTO dto = new ComodoDTO();
            dto.setId(comodo.getId());
            dto.setNome(comodo.getNome());
            dto.setLargura(comodo.getLargura());
            dto.setComprimento(comodo.getComprimento());
            dto.setPosicaoX(comodo.getPosicaoX());
            dto.setPosicaoY(comodo.getPosicaoY());
            comodosDTO.add(dto);
        }
        
        response.setComodos(comodosDTO);
        
        double areaUtilizavel = AREA_MAXIMA_HIS - areaConstruida;
        boolean valida = areaConstruida <= AREA_MAXIMA_HIS && areaTotal <= AREA_MAXIMA_HIS * 2;
        
        response.setValida(valida);
        
        if (valida) {
            response.setMensagemValidacao(String.format(
                "Planta válida - Área construída: %.2f m² / Área restante disponível: %.2f m²",
                areaConstruida, Math.max(0, areaUtilizavel)
            ));
        } else {
            response.setMensagemValidacao("Planta excede limites do programa HIS");
        }
        
        response.setDimencoesPlanta(List.of(areaTotal, areaConstruida, Math.max(0, areaUtilizavel)));
        
        return response;
    }
}