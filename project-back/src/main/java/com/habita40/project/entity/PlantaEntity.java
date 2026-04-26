package com.habita40.project.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "plantas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlantaEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String nome;
    
    @Column
    private Double larguraTotal;
    
    @Column
    private Double comprimentoTotal;
    
    @Column
    private Integer anoConstrucao;
    
    @OneToMany(mappedBy = "planta", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ComodoEntity> comodos = new ArrayList<>();
    
    public Double getAreaTotal() {
        return larguraTotal * comprimentoTotal;
    }
    
    public Double getAreaConstruida() {
        return comodos.stream()
            .mapToDouble(ComodoEntity::getArea)
            .sum();
    }
    
    public void adicionarComodo(ComodoEntity comodo) {
        comodos.add(comodo);
        comodo.setPlanta(this);
    }
}