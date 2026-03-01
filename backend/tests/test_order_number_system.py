"""
Backend API tests for Order Number System feature
Tests: Order number generation, Search by order/email/discord, User request visibility
"""
import pytest
import requests
import os
import uuid
import re

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://purchase-hub-28.preview.emergentagent.com').rstrip('/')

# Test credentials
ADMIN_EMAIL = "ozanmertgemici34@gmail.com"
ADMIN_PASSWORD = "ozan201223"


@pytest.fixture
def admin_token():
    """Get admin auth token"""
    response = requests.post(f"{BASE_URL}/api/auth/login", json={
        "email": ADMIN_EMAIL,
        "password": ADMIN_PASSWORD
    })
    if response.status_code != 200:
        pytest.skip("Admin login failed")
    return response.json()["access_token"]


class TestOrderNumberGeneration:
    """Test that order numbers are generated correctly"""
    
    def test_order_number_format(self, admin_token):
        """Test order number format is JP-YYYYMMDD-XXXX"""
        # Create a purchase request
        unique_email = f"test_order_{uuid.uuid4().hex[:8]}@test.com"
        response = requests.post(
            f"{BASE_URL}/api/purchase-requests/",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={
                "email": unique_email,
                "discord_username": "TestOrder#1234",
                "product": "JustPeek - 1 Month",
                "message": "Testing order number format"
            }
        )
        assert response.status_code in [200, 201], f"Create failed: {response.text}"
        data = response.json()
        
        # Verify order_number exists and has correct format
        assert "order_number" in data, "order_number not in response"
        order_number = data["order_number"]
        
        # Format should be JP-YYYYMMDD-XXXX (4 alphanumeric chars)
        pattern = r'^JP-\d{8}-[A-Z0-9]{4}$'
        assert re.match(pattern, order_number), f"Order number {order_number} doesn't match expected format JP-YYYYMMDD-XXXX"
        print(f"✅ Order number generated with correct format: {order_number}")
        
        # Cleanup
        request_id = data["id"]
        requests.delete(
            f"{BASE_URL}/api/admin/purchase-requests/{request_id}",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
    
    def test_order_number_uniqueness(self, admin_token):
        """Test that each order gets a unique order number"""
        created_requests = []
        order_numbers = set()
        
        # Create multiple requests
        for i in range(3):
            unique_email = f"test_unique_{uuid.uuid4().hex[:8]}@test.com"
            response = requests.post(
                f"{BASE_URL}/api/purchase-requests/",
                headers={"Authorization": f"Bearer {admin_token}"},
                json={
                    "email": unique_email,
                    "discord_username": f"TestUnique{i}#1234",
                    "product": "JustPeek - 1 Month",
                    "message": f"Testing uniqueness {i}"
                }
            )
            assert response.status_code in [200, 201]
            data = response.json()
            created_requests.append(data["id"])
            order_numbers.add(data["order_number"])
        
        # All order numbers should be unique
        assert len(order_numbers) == 3, "Order numbers are not unique"
        print(f"✅ All 3 order numbers are unique: {order_numbers}")
        
        # Cleanup
        for request_id in created_requests:
            requests.delete(
                f"{BASE_URL}/api/admin/purchase-requests/{request_id}",
                headers={"Authorization": f"Bearer {admin_token}"}
            )


class TestAdminSearchByOrderNumber:
    """Test admin search functionality by order number"""
    
    def test_search_by_exact_order_number(self, admin_token):
        """Test searching by exact order number"""
        # Create a purchase request
        unique_email = f"test_search_{uuid.uuid4().hex[:8]}@test.com"
        create_response = requests.post(
            f"{BASE_URL}/api/purchase-requests/",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={
                "email": unique_email,
                "discord_username": "SearchTest#1234",
                "product": "JustPeek - 1 Month",
                "message": "Testing search"
            }
        )
        assert create_response.status_code in [200, 201]
        created_data = create_response.json()
        order_number = created_data["order_number"]
        request_id = created_data["id"]
        
        # Search by order number
        search_response = requests.get(
            f"{BASE_URL}/api/admin/purchase-requests?search={order_number}",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert search_response.status_code == 200
        results = search_response.json()
        
        # Should find exactly our request
        assert len(results) >= 1, "No results found"
        found = any(r["id"] == request_id for r in results)
        assert found, f"Request {request_id} not found in search results"
        
        # Verify the returned result has order_number
        result = next(r for r in results if r["id"] == request_id)
        assert result["order_number"] == order_number
        print(f"✅ Search by order number {order_number} found the request")
        
        # Cleanup
        requests.delete(
            f"{BASE_URL}/api/admin/purchase-requests/{request_id}",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
    
    def test_search_by_partial_order_number(self, admin_token):
        """Test searching by partial order number (JP- prefix)"""
        # Create a request
        unique_email = f"test_partial_{uuid.uuid4().hex[:8]}@test.com"
        create_response = requests.post(
            f"{BASE_URL}/api/purchase-requests/",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={
                "email": unique_email,
                "discord_username": "PartialTest#1234",
                "product": "JustPeek - 1 Month",
                "message": "Testing partial search"
            }
        )
        assert create_response.status_code in [200, 201]
        created_data = create_response.json()
        request_id = created_data["id"]
        
        # Search by JP- prefix - should return results
        search_response = requests.get(
            f"{BASE_URL}/api/admin/purchase-requests?search=JP-",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert search_response.status_code == 200
        results = search_response.json()
        
        # Should find at least our request
        assert len(results) >= 1, "No results found for JP- prefix search"
        print(f"✅ Partial search by 'JP-' returned {len(results)} results")
        
        # Cleanup
        requests.delete(
            f"{BASE_URL}/api/admin/purchase-requests/{request_id}",
            headers={"Authorization": f"Bearer {admin_token}"}
        )


class TestAdminSearchByEmail:
    """Test admin search functionality by email"""
    
    def test_search_by_email(self, admin_token):
        """Test searching by email address"""
        # Create a request with unique email
        unique_email = f"searchable_{uuid.uuid4().hex[:8]}@test.com"
        create_response = requests.post(
            f"{BASE_URL}/api/purchase-requests/",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={
                "email": unique_email,
                "discord_username": "EmailSearch#1234",
                "product": "JustPeek - 1 Month",
                "message": "Testing email search"
            }
        )
        assert create_response.status_code in [200, 201]
        created_data = create_response.json()
        request_id = created_data["id"]
        
        # Search by email
        search_response = requests.get(
            f"{BASE_URL}/api/admin/purchase-requests?search={unique_email}",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert search_response.status_code == 200
        results = search_response.json()
        
        assert len(results) >= 1, "No results found"
        found = any(r["id"] == request_id for r in results)
        assert found, f"Request not found when searching by email"
        print(f"✅ Search by email {unique_email} found the request")
        
        # Cleanup
        requests.delete(
            f"{BASE_URL}/api/admin/purchase-requests/{request_id}",
            headers={"Authorization": f"Bearer {admin_token}"}
        )


class TestAdminSearchByDiscord:
    """Test admin search functionality by Discord username"""
    
    def test_search_by_discord_username(self, admin_token):
        """Test searching by Discord username"""
        # Create a request with unique discord username
        unique_discord = f"UniqueDiscord_{uuid.uuid4().hex[:6]}#1234"
        unique_email = f"discord_search_{uuid.uuid4().hex[:8]}@test.com"
        
        create_response = requests.post(
            f"{BASE_URL}/api/purchase-requests/",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={
                "email": unique_email,
                "discord_username": unique_discord,
                "product": "JustPeek - 1 Month",
                "message": "Testing discord search"
            }
        )
        assert create_response.status_code in [200, 201]
        created_data = create_response.json()
        request_id = created_data["id"]
        
        # Search by Discord username (partial)
        search_term = unique_discord.split('#')[0]  # Get just the name part
        search_response = requests.get(
            f"{BASE_URL}/api/admin/purchase-requests?search={search_term}",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert search_response.status_code == 200
        results = search_response.json()
        
        assert len(results) >= 1, "No results found"
        found = any(r["id"] == request_id for r in results)
        assert found, "Request not found when searching by Discord username"
        print(f"✅ Search by Discord username {search_term} found the request")
        
        # Cleanup
        requests.delete(
            f"{BASE_URL}/api/admin/purchase-requests/{request_id}",
            headers={"Authorization": f"Bearer {admin_token}"}
        )


class TestUserRequestsWithOrderNumber:
    """Test that users see order numbers in their requests"""
    
    def test_user_requests_include_order_number(self, admin_token):
        """Test GET /api/purchase-requests/ returns order_number"""
        # Create a request
        unique_email = f"user_view_{uuid.uuid4().hex[:8]}@test.com"
        create_response = requests.post(
            f"{BASE_URL}/api/purchase-requests/",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={
                "email": unique_email,
                "discord_username": "UserView#1234",
                "product": "JustPeek - 1 Month",
                "message": "Testing user view"
            }
        )
        assert create_response.status_code in [200, 201]
        created_data = create_response.json()
        request_id = created_data["id"]
        expected_order_number = created_data["order_number"]
        
        # Get user's requests
        get_response = requests.get(
            f"{BASE_URL}/api/purchase-requests/",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert get_response.status_code == 200
        results = get_response.json()
        
        # Find our request
        our_request = next((r for r in results if r["id"] == request_id), None)
        assert our_request is not None, "Request not found in user's requests"
        
        # Verify order_number is present
        assert "order_number" in our_request, "order_number not in user's request view"
        assert our_request["order_number"] == expected_order_number
        print(f"✅ User's request view includes order_number: {expected_order_number}")
        
        # Cleanup
        requests.delete(
            f"{BASE_URL}/api/admin/purchase-requests/{request_id}",
            headers={"Authorization": f"Bearer {admin_token}"}
        )


class TestAdminRequestListWithOrderNumber:
    """Test admin request list includes order_number"""
    
    def test_admin_list_includes_order_number(self, admin_token):
        """Test GET /api/admin/purchase-requests returns order_number"""
        # Get admin list
        response = requests.get(
            f"{BASE_URL}/api/admin/purchase-requests",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        results = response.json()
        
        # If there are any requests, they should have order_number field
        if len(results) > 0:
            # Check first result has order_number
            first = results[0]
            assert "order_number" in first, "order_number field missing from admin list"
            print(f"✅ Admin list includes order_number field. First: {first['order_number']}")
        else:
            # Create one to test
            unique_email = f"admin_list_{uuid.uuid4().hex[:8]}@test.com"
            create_response = requests.post(
                f"{BASE_URL}/api/purchase-requests/",
                headers={"Authorization": f"Bearer {admin_token}"},
                json={
                    "email": unique_email,
                    "discord_username": "AdminList#1234",
                    "product": "JustPeek - 1 Month",
                    "message": "Testing admin list"
                }
            )
            assert create_response.status_code in [200, 201]
            request_id = create_response.json()["id"]
            
            # Get list again
            response2 = requests.get(
                f"{BASE_URL}/api/admin/purchase-requests",
                headers={"Authorization": f"Bearer {admin_token}"}
            )
            results2 = response2.json()
            assert len(results2) > 0
            assert "order_number" in results2[0]
            print(f"✅ Admin list includes order_number field")
            
            # Cleanup
            requests.delete(
                f"{BASE_URL}/api/admin/purchase-requests/{request_id}",
                headers={"Authorization": f"Bearer {admin_token}"}
            )


class TestAdminActionsStillWork:
    """Verify admin approve/reject/delete still work after changes"""
    
    def test_approve_request_still_works(self, admin_token):
        """Test admin can still approve requests"""
        # Create
        unique_email = f"approve_test_{uuid.uuid4().hex[:8]}@test.com"
        create_response = requests.post(
            f"{BASE_URL}/api/purchase-requests/",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={
                "email": unique_email,
                "discord_username": "ApproveStill#1234",
                "product": "JustPeek - 1 Month",
                "message": "Testing approve"
            }
        )
        assert create_response.status_code in [200, 201]
        request_id = create_response.json()["id"]
        
        # Approve
        approve_response = requests.put(
            f"{BASE_URL}/api/admin/purchase-requests/{request_id}/status?status=approved",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert approve_response.status_code == 200, f"Approve failed: {approve_response.text}"
        assert approve_response.json().get("success") == True
        print("✅ Approve still works after order number changes")
        
        # Cleanup
        requests.delete(
            f"{BASE_URL}/api/admin/purchase-requests/{request_id}",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
    
    def test_reject_request_still_works(self, admin_token):
        """Test admin can still reject requests"""
        # Create
        unique_email = f"reject_test_{uuid.uuid4().hex[:8]}@test.com"
        create_response = requests.post(
            f"{BASE_URL}/api/purchase-requests/",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={
                "email": unique_email,
                "discord_username": "RejectStill#1234",
                "product": "JustPeek - 1 Month",
                "message": "Testing reject"
            }
        )
        assert create_response.status_code in [200, 201]
        request_id = create_response.json()["id"]
        
        # Reject
        reject_response = requests.put(
            f"{BASE_URL}/api/admin/purchase-requests/{request_id}/status?status=rejected",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert reject_response.status_code == 200, f"Reject failed: {reject_response.text}"
        assert reject_response.json().get("success") == True
        print("✅ Reject still works after order number changes")
        
        # Cleanup
        requests.delete(
            f"{BASE_URL}/api/admin/purchase-requests/{request_id}",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
    
    def test_delete_request_still_works(self, admin_token):
        """Test admin can still delete requests"""
        # Create
        unique_email = f"delete_test_{uuid.uuid4().hex[:8]}@test.com"
        create_response = requests.post(
            f"{BASE_URL}/api/purchase-requests/",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={
                "email": unique_email,
                "discord_username": "DeleteStill#1234",
                "product": "JustPeek - 1 Month",
                "message": "Testing delete"
            }
        )
        assert create_response.status_code in [200, 201]
        request_id = create_response.json()["id"]
        
        # Delete
        delete_response = requests.delete(
            f"{BASE_URL}/api/admin/purchase-requests/{request_id}",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert delete_response.status_code == 200, f"Delete failed: {delete_response.text}"
        assert delete_response.json().get("success") == True
        print("✅ Delete still works after order number changes")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
