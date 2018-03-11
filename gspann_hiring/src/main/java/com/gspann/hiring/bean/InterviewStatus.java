package com.gspann.hiring.bean;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.gspann.hiring.bean.JsonDateSerializer;

/**
 * 
 * @author Tapas Ranjan Joshi
 *
 */
@Entity
public class InterviewStatus {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private int interviewId;
	private int interviewLevel;
	private String interviewer;
	private Date assignedDate;
	private String result;
	private long candidateId;
	
	public int getInterviewId() {
		return interviewId;
	}
	public void setInterviewId(int interviewId) {
		this.interviewId = interviewId;
	}
	public int getInterviewLevel() {
		return interviewLevel;
	}
	public void setInterviewLevel(int interviewLevel) {
		this.interviewLevel = interviewLevel;
	}
	public String getInterviewer() {
		return interviewer;
	}
	public void setInterviewer(String interviewer) {
		this.interviewer = interviewer;
	}
	@JsonSerialize(using=JsonDateSerializer.class)
	public Date getAssignedDate() {
		return assignedDate;
	}
	public void setAssignedDate(Date assignedDate) {
		this.assignedDate = assignedDate;
	}
	public String getResult() {
		return result;
	}
	public void setResult(String result) {
		this.result = result;
	}
	public long getCandidateId() {
		return candidateId;
	}
	public void setCandidateId(long candidateId) {
		this.candidateId = candidateId;
	}
	
	
	
	
	
	
	

}
