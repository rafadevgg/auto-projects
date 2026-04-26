package com.habita40.project.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "comodos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComodoEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String nome;
    
    @Column(nullable = false)
    private Double largura;
    
    @Column(nullable = false)
    private Double comprimento;
    
    @Column
    private Integer posicaoX;
    
    @Column
    private Integer posicaoY;
    
    @ManyToOne
    @JoinColumn(name = "planta_id")
    private PlantaEntity planta;
    
    public Double getArea() {
        return largura * comprimento;
    }
}