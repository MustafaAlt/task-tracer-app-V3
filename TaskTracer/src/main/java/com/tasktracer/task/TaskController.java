package com.tasktracer.task;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    public List<Task> list(Authentication auth) {
        return taskService.myTasks(auth.getName());
    }

    @PostMapping
    public Task create(@RequestBody Task task, Authentication auth) {
        return taskService.create(auth.getName(), task);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> update(@PathVariable Long id, @RequestBody Task patch, Authentication auth) {
        return ResponseEntity.ok(taskService.update(auth.getName(), id, patch));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication auth) {
        taskService.delete(auth.getName(), id);
        return ResponseEntity.noContent().build();
    }
}
