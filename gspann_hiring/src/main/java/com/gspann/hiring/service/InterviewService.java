package com.gspann.hiring.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gspann.hiring.bean.Candidate;
import com.gspann.hiring.bean.InterviewStatus;
import com.gspann.hiring.bean.Interviewer;
import com.gspann.hiring.bean.Organization;
import com.gspann.hiring.dao.CandidateDAO;
import com.gspann.hiring.dao.CandidateRepository;
import com.gspann.hiring.dao.InterviewStatusRepository;
import com.gspann.hiring.dao.InterviewerRepository;
import com.gspann.hiring.dao.OrganizationRepository;

@Service
public class InterviewService {
	
	@Autowired
	private CandidateRepository candidateRepository;
	
	@Autowired
	private InterviewStatusRepository interviewStatusRepository;
	
	@Autowired
	private OrganizationRepository orgRepository;
	
	@Autowired
	private InterviewerRepository interviewerRepo;
	
	@Autowired
	private CandidateDAO candidateDao;
	
	public Candidate addCandidate(Candidate candidate) {
		return candidateRepository.save(candidate);
	}
	
	public Candidate getCandidate(long candidateId) {
		return candidateRepository.findOne(candidateId);
	}
	
	public InterviewStatus addInterview(InterviewStatus interview) {
		return interviewStatusRepository.save(interview);
	}
	
	public List<InterviewStatus> getInterviewStatus(long candidateId){
		return interviewStatusRepository.findInterviewStatusByCandidateId(candidateId);
	}
	
	public List<Candidate> getAllCandidates(){
		return (List<Candidate>) candidateRepository.findAll();
	}
	
	public List<Organization> getAllOrganizations(){
		return (List<Organization>) orgRepository.findAll();
	}
	
	public Organization addOrganization(Organization org) {
		return orgRepository.save(org);
	}
	
	public List<Interviewer> getInterviewers(){
		return (List<Interviewer>)interviewerRepo.findAll();
	}
	
	public boolean updateResume(byte[] resume, long candidateId) {
		return candidateDao.updateResume(resume, candidateId);
	}

}
