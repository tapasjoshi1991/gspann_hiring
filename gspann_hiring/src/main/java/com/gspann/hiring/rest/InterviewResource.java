package com.gspann.hiring.rest;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import javax.activation.DataHandler;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;

import com.gspann.hiring.bean.Candidate;
import com.gspann.hiring.bean.InterviewStatus;
import com.gspann.hiring.bean.Interviewer;
import com.gspann.hiring.bean.Organization;
import com.gspann.hiring.service.InterviewService;
import com.gspann.hiring.util.Mailer;

@RestController
public class InterviewResource {

	@Autowired
	private InterviewService interviewService;

	@PostMapping("/candidate")
	public ResponseEntity<Candidate> addCandidate(@RequestBody Candidate candidate, UriComponentsBuilder uriBuilder) {
		// System.out.println("Hit the server!!!");
		Candidate resultantCandidate = interviewService.addCandidate(candidate);
		Organization org = new Organization();
		org.setOrgName(candidate.getOrganization());
		interviewService.addOrganization(org);
		System.out.println(candidate);
		if (resultantCandidate != null) {
			HttpHeaders headers = new HttpHeaders();
			headers.setLocation(uriBuilder.path("/candidate/{candidateId}")
					.buildAndExpand(resultantCandidate.getCandidateId()).toUri());
			return new ResponseEntity<Candidate>(resultantCandidate, headers, HttpStatus.CREATED);
		} else {
			return new ResponseEntity<Candidate>(null, null, HttpStatus.EXPECTATION_FAILED);
		}
	}

	@PostMapping("/uploadResume")
	public ResponseEntity uploadResume(@RequestParam("uploadFile") MultipartFile uploadfile,
			@RequestParam("candidateId") long candidateId) {
		if (uploadfile.isEmpty()) {
			return new ResponseEntity("please select a file!", HttpStatus.OK);
		}
		System.out.println(uploadfile.getSize());
		byte[] bytes;
		try {
			bytes = uploadfile.getBytes();
			// Path path = Paths.get("D:\\" + uploadfile.getOriginalFilename());
			// Files.write(path, bytes);
			boolean flag = interviewService.updateResume(bytes, uploadfile.getOriginalFilename(), candidateId);
			System.out.println(flag);
			return ResponseEntity.ok().build();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).build();
		}

	}

	@PostMapping("/interview")
	public ResponseEntity<InterviewStatus> addInterview(@RequestBody InterviewStatus interview) {

		InterviewStatus resultantInterview = interviewService.addInterview(interview);
		Candidate candidate = interviewService.getCandidate(interview.getCandidateId());
		candidate.setCandidateStatus("ASSIGNED");
		candidate.setInterviewLevel(interview.getInterviewLevel());
		candidate.setLastInterviewedBy(interview.getInterviewer());
		interviewService.updateCandidate(candidate);
		Path path = Paths.get(".\\" + candidate.getResumeName());
		try {
			Files.write(path, candidate.getResume());
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		Mailer.send(candidate.getLastInterviewedBy(),
				"Interview level : " + candidate.getInterviewLevel() + " for candidate " + candidate.getName() + "",
				"Please take the interview and share the feedback", candidate.getResumeName());
		Optional<InterviewStatus> opt = Optional.of(resultantInterview);
		if (opt.isPresent()) {
			return new ResponseEntity<InterviewStatus>(resultantInterview, null, HttpStatus.CREATED);
		} else {
			return new ResponseEntity<InterviewStatus>(null, null, HttpStatus.EXPECTATION_FAILED);
		}

	}

	@GetMapping("/downloadResume/{candidateId}")
	public ResponseEntity<ByteArrayResource> getSteamingFile(@PathVariable("candidateId") long candidateId,
			HttpServletResponse response) throws IOException {
		// response.setContentType("application/msword");
		// Candidate candidate = interviewService.getCandidate(candidateId);
		// response.setHeader("Content-Disposition", "attachment;
		// filename=\""+candidate.getName()+".doc\"");
		// //InputStream inputStream = new FileInputStream(new
		// File("C:\\demo-file.pdf"));
		// return outputStream -> {
		// outputStream.write(candidate.getResume());
		// };

		Candidate candidate = interviewService.getCandidate(candidateId);
		Path path = Paths.get(".\\" + candidate.getResumeName());
		Files.write(path, candidate.getResume());
		ByteArrayResource attachment = new ByteArrayResource(candidate.getResume());

		ByteArrayResource resource = new ByteArrayResource(candidate.getResume());

		return ResponseEntity.ok()
				.header(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=" + candidate.getResumeName())
				.contentType(MediaType.MULTIPART_FORM_DATA).body(resource);
	}

	@GetMapping("/candidates")
	public ResponseEntity<List<Candidate>> getAllCandidates() {
		return ResponseEntity.ok(interviewService.getAllCandidates());
	}

	@PostMapping("/candidateTest")
	public ResponseEntity<Candidate> addTestCandidate() {
		Candidate can = new Candidate();

		can.setCandidateStatus("New");
		can.setCreationDate(new Date(System.currentTimeMillis()));
		can.setExperience("3 yrs");
		can.setIfs("D:/interview/candidates/");
		can.setInterviewLevel(0);
		can.setLastInterviewedBy("");
		can.setName("Tapas Ranjan Joshi");
		can.setOrganization("Oracle");
		// can.setResume("D:/interview/resume");
		can.setRole("Developer");
		// can.setInterviewStatusList(arrList);
		Candidate resultantCandidate = interviewService.addCandidate(can);

		InterviewStatus i1 = new InterviewStatus();
		i1.setInterviewer("Balaram");
		i1.setInterviewLevel(1);
		i1.setResult("Pursued");
		i1.setAssignedDate(new Date(System.currentTimeMillis()));
		// i1.setCandidateId(1);
		i1.setCandidateId(resultantCandidate.getCandidateId());

		InterviewStatus i2 = new InterviewStatus();
		i2.setInterviewer("Varun");
		i2.setInterviewLevel(2);
		i2.setResult("Pursued");
		i2.setAssignedDate(new Date(System.currentTimeMillis()));
		// i2.setCandidateId(1);
		i2.setCandidateId(resultantCandidate.getCandidateId());
		interviewService.addInterview(i1);
		interviewService.addInterview(i2);

		List<InterviewStatus> interviewStatus = interviewService
				.getInterviewStatus(resultantCandidate.getCandidateId());
		resultantCandidate.setInterviewStatusList(interviewStatus);
		return ResponseEntity.ok(resultantCandidate);
	}

	@GetMapping("/getCandidate/{candidateId}")
	public ResponseEntity<Candidate> getCandidateById(@PathVariable("candidateId") long candidateId) {
		return ResponseEntity.ok(interviewService.getCandidate(candidateId));
	}

	@GetMapping("/organizations")
	public ResponseEntity<List<Organization>> getOrgList() {
		List<Organization> orgList = interviewService.getAllOrganizations();
		Organization org = new Organization();
		org.setOrgId(100000);
		org.setOrgName("other");
		orgList.add(org);
		return ResponseEntity.ok(orgList);
	}

	@GetMapping("/interviewers")
	public ResponseEntity<List<Interviewer>> getInterviewers() {
		return ResponseEntity.ok(interviewService.getInterviewers());
	}

}
