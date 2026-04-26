package com.habita40.project.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlantaRequestDTO {
    
    @NotBlank(message = "Nome é obrigatório")
    private String nome;
    
    @NotNull(message = "Largura total é obrigatória")
    @Min(value = 500, message = "Largura mínima é 500 cm")
    @Max(value = 1500, message = "Largura máxima é 1500 cm")
    private Double larguraTotal;
    
    @NotNull(message = "Comprimento total é obrigatório")
    @Min(value = 500, message = "Comprimento mínimo é 500 cm")
    @Max(value = 1500, message = "Comprimento máximo é 1500 cm")
    private Double comprimentoTotal;
    
    @NotNull(message = "Ano de construção é obrigatório")
    @Min(value = 2024, message = "Ano mínimo é 2024")
    private Integer anoConstrucao;
    
    @NotNull(message = "Lista de cômodos é obrigatória")
    @Size(min = 1, message = "Deve ter pelo menos um cômodo")
    private List<ComodoDTO> comodos;
}