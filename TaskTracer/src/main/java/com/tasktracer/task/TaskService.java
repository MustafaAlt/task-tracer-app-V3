package com.tasktracer.task;

import com.tasktracer.user.User;
import com.tasktracer.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public List<Task> myTasks(String username) {
        User me = userRepository.findByUsername(username).orElseThrow();
        return taskRepository.findByOwner(me);
    }

    public Task create(String username, Task task) {
        User me = userRepository.findByUsername(username).orElseThrow();
        task.setOwner(me);
        if (task.getStatus() == null) task.setStatus(TaskStatus.TODO);
        return taskRepository.save(task);
    }

    public Task update(String username, Long id, Task patch) {
        User me = userRepository.findByUsername(username).orElseThrow();
        Task t = taskRepository.findByIdAndOwner(id, me).orElseThrow();
        if (patch.getTitle() != null) t.setTitle(patch.getTitle());
        if (patch.getDescription() != null) t.setDescription(patch.getDescription());
        if (patch.getStatus() != null) t.setStatus(patch.getStatus());
        if (patch.getDueDate() != null) t.setDueDate(patch.getDueDate());
        return taskRepository.save(t);
    }

    public void delete(String username, Long id) {
        User me = userRepository.findByUsername(username).orElseThrow();
        Task t = taskRepository.findByIdAndOwner(id, me).orElseThrow();
        taskRepository.delete(t);
    }
}
