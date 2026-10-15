package com.example.modelplatform;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ModelRepository extends JpaRepository<ModelDefinition, Long> {
}