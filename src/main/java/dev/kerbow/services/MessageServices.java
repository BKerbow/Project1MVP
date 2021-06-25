package dev.kerbow.services;

import java.util.List;

import dev.kerbow.models.Author;
import dev.kerbow.models.Editor;
import dev.kerbow.models.Messages;
import dev.kerbow.models.Story;
import dev.kerbow.repositories.MessagesRepo;

public class MessageServices {
	private static MessageServices instance;
	private MessagesRepo repo = new MessagesRepo();
	
	private MessageServices() {}
	
	public static MessageServices getInstance() {
		if (instance == null) instance = new MessageServices();
		return instance;
	}
	
	public Messages addMessage(Messages m) {
		return this.repo.add(m);
	}
	
	public Messages getById(Integer id) {
		return this.repo.getById(id);
	}

}
