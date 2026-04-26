package com.habita40.project.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComodoDTO {
    
    private Long id;
    
    @NotBlank(message = "Nome do cômodo é obrigatório")
    private String nome;
    
    @NotNull(message = "Largura é obrigatória")
    @Min(value = 200, message = "Largura mínima é 200 cm")
    @Max(value = 1000, message = "Largura máxima é 1000 cm")
    private Double largura;
    
    @NotNull(message = "Comprimento é obrigatório")
    @Min(value = 200, message = "Comprimento mínimo é 200 cm")
    @Max(value = 1000, message = "Comprimento máximo é 1000 cm")
    private Double comprimento;
    
    private Integer posicaoX;
    
    private Integer posicaoY;
    
    public Double getArea() {
        return largura * comprimento;
    }
}