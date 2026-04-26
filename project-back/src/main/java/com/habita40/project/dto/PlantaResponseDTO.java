package com.habita40.project.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlantaResponseDTO {
    
    private Long id;
    private String nome;
    private Double larguraTotal;
    private Double comprimentoTotal;
    private Integer anoConstrucao;
    private Double areaTotal;
    private Double areaConstruida;
    private List<ComodoDTO> comodos;
    private Boolean valida;
    private String mensagemValidacao;
    private List<Double> dimencoesPlanta;
}