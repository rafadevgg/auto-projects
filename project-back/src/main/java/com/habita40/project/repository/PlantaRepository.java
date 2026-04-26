package com.habita40.project.repository;

import com.habita40.project.entity.PlantaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlantaRepository extends JpaRepository<PlantaEntity, Long> {
}