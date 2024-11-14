package com.Timperio.controller;

import java.io.File;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/uml")
public class UMLController {

    @GetMapping("/timperio")
    public ResponseEntity<Resource> getUmlDiagram() {

        String path = "src/main/resources/static/uml/timperio.drawio";
        Resource resource = new FileSystemResource(new File(path));
        return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"timperio.drawio\"")
                .body(resource);
    }
}
