package com.tasktracer.task;

import com.tasktracer.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task,Long> {
    List<Task> findByOwner(User owner);
    Optional<Task> findByIdAndOwner(Long id, User owner);
}
