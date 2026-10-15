package com.example.modelplatform;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/models")
@CrossOrigin(origins = "http://localhost:5173")
public class ModelController {
    private final ModelRepository repository;
    private final ObjectMapper objectMapper;

    public ModelController(ModelRepository repository, ObjectMapper objectMapper) {
        this.repository = repository;
        this.objectMapper = objectMapper;
    }

    @GetMapping
    public List<Map<String, Object>> getAllModels() {
        return repository.findAll().stream().map(model -> Map.<String, Object>of(
            "id", model.getId(),
            "name", model.getName(),
            "fields", parseFields(model.getFieldsJson())
        )).toList();
    }

    @PostMapping
    public ResponseEntity<?> saveModel(@RequestBody Map<String, Object> request) {
        Object nameObject = request.get("name");
        Object fieldsObject = request.get("fields");

        if (!(nameObject instanceof String name) || name.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Model name is required."));
        }
        if (!(fieldsObject instanceof List<?> fields) || fields.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "At least one field is required."));
        }

        try {
            String fieldsJson = objectMapper.writeValueAsString(fields);
            ModelDefinition saved = repository.save(new ModelDefinition(name.trim(), fieldsJson));
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "id", saved.getId(),
                "name", saved.getName(),
                "fields", fields
            ));
        } catch (Exception exception) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Could not save model."));
        }
    }

    private Object parseFields(String json) {
        try {
            return objectMapper.readValue(json, Object.class);
        } catch (Exception exception) {
            return List.of();
        }
    }
}