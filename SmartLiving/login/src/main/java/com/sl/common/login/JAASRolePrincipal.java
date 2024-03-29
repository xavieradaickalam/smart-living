package com.sl.common.login;

import java.io.Serializable;
import java.security.Principal;

public class JAASRolePrincipal implements Principal, Serializable {

	private static final long serialVersionUID = -7852603403115950892L;
	
	private String name;

	/**
	 * @param name
	 */
	public JAASRolePrincipal(String name) {
		if (name == null) {
			throw new NullPointerException("NULL role name");
		}
		this.name = name;
	}

	public String getName() {
		return name;
	}

	@Override
	public String toString() {
		return "JASSRolePrincipal [name=" + name + "]";
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((name == null) ? 0 : name.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		JAASRolePrincipal other = (JAASRolePrincipal) obj;
		if (name == null) {
			if (other.name != null)
				return false;
		} else if (!name.equals(other.name))
			return false;

		return true;
	}
}