package dev.kerbow.repositories;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.HashMap;
import java.util.Map;

import dev.kerbow.models.Author;
import dev.kerbow.models.Editor;
import dev.kerbow.models.Genre;
import dev.kerbow.models.Messages;
import dev.kerbow.models.Story;
import dev.kerbow.models.StoryType;
import dev.kerbow.utils.JDBCConnection;

public class MessagesRepo implements GenericRepo<Messages> {
	private Connection conn = JDBCConnection.getConnection();

	public Messages add(Messages m) {

		String sql = "insert into messages values (default, ?, ?, ?, ?, ?, ?) returning *";

		try {

			PreparedStatement ps = conn.prepareStatement(sql);
			ps.setInt(1, m.getTitle().getId());
			ps.setInt(2, m.getFromEditor().getId());
			ps.setInt(3, m.getAuthor().getId());
			ps.setNull(4, Types.INTEGER);
			ps.setString(5, m.getEditorMessage());
			ps.setString(6, m.getAuthorMessage());
			ResultSet rs = ps.executeQuery();

			if (rs.next()) {
				m.setId(rs.getInt("id"));
				return m;
			}

		} catch (SQLException e) {
			e.printStackTrace();
		}

		return null;
	}

	@Override
	public Messages getById(Integer id) {

		String sql = "select * from messages where id = ?;";

		try {
			PreparedStatement ps = conn.prepareStatement(sql);
			ps.setInt(1, id);
			ResultSet rs = ps.executeQuery();

			if (rs.next()) return this.make(rs);

		} catch (SQLException e) {
			e.printStackTrace();
		}

		return null;
	}
	
	public Messages getEditorMessage(String fromEditor) {
		
		String sql = "select s.title, e.first_name, m.editorMessage from messages m " 
				+ " left join stories s on m.id = s.id "
				+ "left join editors e on m.id = e.id "
				+ "where a.id = ? and s.id = ?;";
		try {
			PreparedStatement ps = conn.prepareStatement(sql);
			ps.setString(1, fromEditor);
			ResultSet rs = ps.executeQuery();
			if (rs.next()) this.make(rs);
		} catch(SQLException e) {
			e.printStackTrace();
		}
		return null;
	}
	
public Messages getAuthorMessage(String fromAuthor) {
		
		String sql = "select s.title, a.first_name, m.editorMessage from messages m " 
				+ "left join stories s on m.id = s.id "
				+ "left join editors a on m.id = a.id "
				+ "where e.id = ? and s.id = ?;";
		try {
			PreparedStatement ps = conn.prepareStatement(sql);
			ps.setString(1, fromAuthor);
			ResultSet rs = ps.executeQuery();
			if (rs.next()) this.make(rs);
		} catch(SQLException e) {
			e.printStackTrace();
		}
		return null;
	}

public Messages getOtherEditorMessage(String receiveEditor) {
	String sql = "select s.title, e.first_name, m.editorMessage from messages m "
			+ "left join stories s on m.id = s.id "
			+ "left join editors e on m.receiveeditor = e.id;";
	try {
		PreparedStatement ps = conn.prepareStatement(sql);
		ps.setString(1, receiveEditor);
		ResultSet rs = ps.executeQuery();
		if (rs.next()) this.make(rs);
	} catch (SQLException e) {
		e.printStackTrace();
	}
	
	return null;
			
}
	
	public Messages getByAuthorName(String fromAuthor) {
		
		String sql = "select s.title, a.first_name, m.authorMessage";
		try {
			PreparedStatement ps = conn.prepareStatement(sql);
			ps.setString(1, fromAuthor);
			ResultSet rs = ps.executeQuery();
			if (rs.next()) return this.make(rs);
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		return null;
		
	}

	@Override
	public Map<Integer, Messages> getAll() {

		String sql = "select * from messages;";

		try {
			Map<Integer, Messages> map = new HashMap<Integer, Messages>();
			PreparedStatement ps = conn.prepareStatement(sql);
			ResultSet rs = ps.executeQuery();

			while (rs.next()) {
				Messages m = this.make(rs);
				map.put(m.getId(), m);
			}

			return map;

		} catch (SQLException e) {
			e.printStackTrace();
		}

		return null;
	}

	@Override
	public boolean update(Messages m) {

		String sql = "update Messages set title = ?, fromEditor = ?, author = ?, editorMessage = ?, authorMessage = ?, where id = ? returning *;";

		try {
			PreparedStatement ps = conn.prepareStatement(sql);
			ps.setInt(1, m.getTitle().getId());
			ps.setInt(2, m.getFromEditor().getId());
			ps.setInt(3, m.getAuthor().getId());
			ps.setString(4, m.getEditorMessage());
			ps.setString(5, m.getAuthorMessage());
			ps.setInt(6, m.getId());

			return ps.execute();

		} catch (SQLException e) {
			e.printStackTrace();
		}

		return false;
	}

	@Override
	public boolean delete(Messages m) {

		String sql = "delete from messages where id = ?;";

		try {
			PreparedStatement ps = conn.prepareStatement(sql);
			ps.setInt(1, m.getId());

			return ps.execute();

		} catch (SQLException e) {
			e.printStackTrace();
		}

		return false;
	}

	@Override
	public Messages make(ResultSet rs) throws SQLException {

		Messages m = new Messages();
		m.setId(rs.getInt("id"));
		//gotta fix the next two lines to get the right title
		Story s = (new StoryRepo().getById(rs.getInt("id")));
		m.setTitle(s);
		Editor e = (new EditorRepo()).getById(rs.getInt("fromEditor"));
		Editor re = (new EditorRepo()).getById(rs.getInt("receiveEditor"));
		m.setFromEditor(e);
		m.setReceiveEditor(re);
		m.setEditorMessage(rs.getString("editorMessage"));
		m.setAuthorMessage(rs.getString("authorMessage"));

		return m;
	}

}