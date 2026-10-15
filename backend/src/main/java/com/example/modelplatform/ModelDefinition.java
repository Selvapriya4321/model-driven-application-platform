package com.example.modelplatform;

import jakarta.persistence.*;

@Entity
@Table(name = "model_definitions")
public class ModelDefinition {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String fieldsJson;

    public ModelDefinition() {}

    public ModelDefinition(String name, String fieldsJson) {
        this.name = name;
        this.fieldsJson = fieldsJson;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getFieldsJson() { return fieldsJson; }
    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setFieldsJson(String fieldsJson) { this.fieldsJson = fieldsJson; }
}