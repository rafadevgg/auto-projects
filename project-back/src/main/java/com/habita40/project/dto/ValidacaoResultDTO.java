package com.habita40.project.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ValidacaoResultDTO {
    
    private Boolean valida;
    private List<String> mensagens;
    private Double areaTotal;
    private Double areaConstruida;
    private Double areaRestante;
}