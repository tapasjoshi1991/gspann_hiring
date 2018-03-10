package com.gspann.hiring.dao;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.gspann.hiring.bean.Candidate;

@Repository
public interface CandidateRepository extends CrudRepository<Candidate, Long> {

}
