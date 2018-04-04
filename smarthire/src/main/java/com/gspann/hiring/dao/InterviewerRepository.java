package com.gspann.hiring.dao;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.gspann.hiring.bean.Interviewer;

@Repository
public interface InterviewerRepository extends CrudRepository<Interviewer, Long> {
		
}
