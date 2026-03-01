"""
Backend API tests for Revenue Flow & Analytics feature
Tests:
1. PUT /api/admin/purchase-requests/{id}/status - accepts 'completed' and 'cancelled' statuses
2. Approving a request does NOT create a purchase/revenue record
3. Completing a request DOES create a purchase with correct product price
4. GET /api/admin/stats returns approved_requests and completed_requests counts
5. GET /api/admin/analytics returns chart data (daily_registrations, monthly_revenue, daily_revenue, status_distribution, product_distribution)
"""
import pytest
import requests
import os
import uuid
import time

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://purchase-hub-28.preview.emergentagent.com').rstrip('/')

# Test credentials
ADMIN_EMAIL = "ozanmertgemici34@gmail.com"
ADMIN_PASSWORD = "ozan201223"

# Product prices as per PRODUCT_PRICES in admin_routes.py
PRODUCT_PRICES = {
    "JustPeek - 1 Week": {"price": "$2.99", "days": 7},
    "JustPeek - 1 Month": {"price": "$6.99", "days": 30},
    "JustPeek - 2 Months": {"price": "$11.99", "days": 60},
}


@pytest.fixture
def admin_token():
    """Get admin auth token"""
    response = requests.post(f"{BASE_URL}/api/auth/login", json={
        "email": ADMIN_EMAIL,
        "password": ADMIN_PASSWORD
    })
    if response.status_code != 200:
        pytest.skip(f"Admin login failed: {response.text}")
    return response.json()["access_token"]


@pytest.fixture
def admin_headers(admin_token):
    """Admin headers with auth"""
    return {"Authorization": f"Bearer {admin_token}"}


class TestNewStatusValues:
    """Test that the status endpoint accepts 'completed' and 'cancelled' statuses"""
    
    def test_status_completed_accepted(self, admin_headers):
        """Test that 'completed' status is accepted"""
        # Create a pending request
        unique_email = f"test_completed_{uuid.uuid4().hex[:8]}@test.com"
        create_response = requests.post(
            f"{BASE_URL}/api/purchase-requests/",
            headers=admin_headers,
            json={
                "email": unique_email,
                "discord_username": "CompletedTest#1234",
                "product": "JustPeek - 1 Month",
                "message": "Testing completed status"
            }
        )
        assert create_response.status_code in [200, 201], f"Create failed: {create_response.text}"
        request_id = create_response.json()["id"]
        
        # First approve
        approve_response = requests.put(
            f"{BASE_URL}/api/admin/purchase-requests/{request_id}/status?status=approved",
            headers=admin_headers
        )
        assert approve_response.status_code == 200, f"Approve failed: {approve_response.text}"
        
        # Then complete
        complete_response = requests.put(
            f"{BASE_URL}/api/admin/purchase-requests/{request_id}/status?status=completed",
            headers=admin_headers
        )
        assert complete_response.status_code == 200, f"Complete failed: {complete_response.text}"
        assert complete_response.json().get("success") == True
        print("✅ 'completed' status is accepted")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/admin/purchase-requests/{request_id}", headers=admin_headers)
    
    def test_status_cancelled_accepted(self, admin_headers):
        """Test that 'cancelled' status is accepted"""
        # Create a pending request
        unique_email = f"test_cancelled_{uuid.uuid4().hex[:8]}@test.com"
        create_response = requests.post(
            f"{BASE_URL}/api/purchase-requests/",
            headers=admin_headers,
            json={
                "email": unique_email,
                "discord_username": "CancelledTest#1234",
                "product": "JustPeek - 1 Month",
                "message": "Testing cancelled status"
            }
        )
        assert create_response.status_code in [200, 201], f"Create failed: {create_response.text}"
        request_id = create_response.json()["id"]
        
        # First approve
        approve_response = requests.put(
            f"{BASE_URL}/api/admin/purchase-requests/{request_id}/status?status=approved",
            headers=admin_headers
        )
        assert approve_response.status_code == 200, f"Approve failed: {approve_response.text}"
        
        # Then cancel
        cancel_response = requests.put(
            f"{BASE_URL}/api/admin/purchase-requests/{request_id}/status?status=cancelled",
            headers=admin_headers
        )
        assert cancel_response.status_code == 200, f"Cancel failed: {cancel_response.text}"
        assert cancel_response.json().get("success") == True
        print("✅ 'cancelled' status is accepted")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/admin/purchase-requests/{request_id}", headers=admin_headers)
    
    def test_invalid_status_rejected(self, admin_headers):
        """Test that invalid status is rejected"""
        # Create a pending request
        unique_email = f"test_invalid_{uuid.uuid4().hex[:8]}@test.com"
        create_response = requests.post(
            f"{BASE_URL}/api/purchase-requests/",
            headers=admin_headers,
            json={
                "email": unique_email,
                "discord_username": "InvalidTest#1234",
                "product": "JustPeek - 1 Month",
                "message": "Testing invalid status"
            }
        )
        assert create_response.status_code in [200, 201]
        request_id = create_response.json()["id"]
        
        # Try invalid status
        invalid_response = requests.put(
            f"{BASE_URL}/api/admin/purchase-requests/{request_id}/status?status=invalid_status",
            headers=admin_headers
        )
        assert invalid_response.status_code == 400, f"Should reject invalid status: {invalid_response.text}"
        print("✅ Invalid status is correctly rejected")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/admin/purchase-requests/{request_id}", headers=admin_headers)


class TestRevenueFlow:
    """Test the new revenue flow: approve does NOT create purchase, complete DOES"""
    
    def test_approve_does_not_create_purchase(self, admin_headers):
        """Test that approving a request does NOT create a purchase record"""
        # Get initial stats
        stats_before = requests.get(f"{BASE_URL}/api/admin/stats", headers=admin_headers).json()
        total_purchases_before = stats_before["total_purchases"]
        
        # Create a request
        unique_email = f"test_approve_no_purchase_{uuid.uuid4().hex[:8]}@test.com"
        create_response = requests.post(
            f"{BASE_URL}/api/purchase-requests/",
            headers=admin_headers,
            json={
                "email": unique_email,
                "discord_username": "ApproveNoPurchase#1234",
                "product": "JustPeek - 1 Month",
                "message": "Testing approve doesn't create purchase"
            }
        )
        assert create_response.status_code in [200, 201]
        request_id = create_response.json()["id"]
        
        # Approve the request
        approve_response = requests.put(
            f"{BASE_URL}/api/admin/purchase-requests/{request_id}/status?status=approved",
            headers=admin_headers
        )
        assert approve_response.status_code == 200
        
        # Check stats - total_purchases should NOT have increased
        stats_after = requests.get(f"{BASE_URL}/api/admin/stats", headers=admin_headers).json()
        total_purchases_after = stats_after["total_purchases"]
        
        assert total_purchases_after == total_purchases_before, \
            f"Approving should NOT create purchase! Before: {total_purchases_before}, After: {total_purchases_after}"
        print("✅ Approving a request does NOT create a purchase record")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/admin/purchase-requests/{request_id}", headers=admin_headers)
    
    def test_complete_creates_purchase(self, admin_headers):
        """Test that completing a request DOES create a purchase record"""
        # Get initial stats
        stats_before = requests.get(f"{BASE_URL}/api/admin/stats", headers=admin_headers).json()
        total_purchases_before = stats_before["total_purchases"]
        
        # Create a request
        unique_email = f"test_complete_purchase_{uuid.uuid4().hex[:8]}@test.com"
        create_response = requests.post(
            f"{BASE_URL}/api/purchase-requests/",
            headers=admin_headers,
            json={
                "email": unique_email,
                "discord_username": "CompletePurchase#1234",
                "product": "JustPeek - 1 Month",
                "message": "Testing complete creates purchase"
            }
        )
        assert create_response.status_code in [200, 201]
        request_id = create_response.json()["id"]
        
        # Approve first
        approve_response = requests.put(
            f"{BASE_URL}/api/admin/purchase-requests/{request_id}/status?status=approved",
            headers=admin_headers
        )
        assert approve_response.status_code == 200
        
        # Complete the request
        complete_response = requests.put(
            f"{BASE_URL}/api/admin/purchase-requests/{request_id}/status?status=completed",
            headers=admin_headers
        )
        assert complete_response.status_code == 200
        
        # Check stats - total_purchases SHOULD have increased
        stats_after = requests.get(f"{BASE_URL}/api/admin/stats", headers=admin_headers).json()
        total_purchases_after = stats_after["total_purchases"]
        
        assert total_purchases_after == total_purchases_before + 1, \
            f"Completing should create purchase! Before: {total_purchases_before}, After: {total_purchases_after}"
        print("✅ Completing a request DOES create a purchase record")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/admin/purchase-requests/{request_id}", headers=admin_headers)
    
    def test_complete_creates_purchase_with_correct_price_1_week(self, admin_headers):
        """Test that completing creates purchase with correct price for 1 Week ($2.99)"""
        product = "JustPeek - 1 Week"
        expected_price = "$2.99"
        
        # Create and complete a request
        unique_email = f"test_price_1week_{uuid.uuid4().hex[:8]}@test.com"
        create_response = requests.post(
            f"{BASE_URL}/api/purchase-requests/",
            headers=admin_headers,
            json={
                "email": unique_email,
                "discord_username": "PriceTest1Week#1234",
                "product": product,
                "message": "Testing 1 Week price"
            }
        )
        assert create_response.status_code in [200, 201]
        request_id = create_response.json()["id"]
        
        # Approve and complete
        requests.put(f"{BASE_URL}/api/admin/purchase-requests/{request_id}/status?status=approved", headers=admin_headers)
        requests.put(f"{BASE_URL}/api/admin/purchase-requests/{request_id}/status?status=completed", headers=admin_headers)
        
        # Check the purchase was created with correct price
        purchases = requests.get(f"{BASE_URL}/api/purchases/", headers=admin_headers).json()
        matching_purchase = next((p for p in purchases if p.get("product") == product and p.get("price") == expected_price), None)
        
        assert matching_purchase is not None, f"No purchase found with product={product} and price={expected_price}"
        print(f"✅ 1 Week purchase created with correct price: {expected_price}")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/admin/purchase-requests/{request_id}", headers=admin_headers)
    
    def test_complete_creates_purchase_with_correct_price_1_month(self, admin_headers):
        """Test that completing creates purchase with correct price for 1 Month ($6.99)"""
        product = "JustPeek - 1 Month"
        expected_price = "$6.99"
        
        unique_email = f"test_price_1month_{uuid.uuid4().hex[:8]}@test.com"
        create_response = requests.post(
            f"{BASE_URL}/api/purchase-requests/",
            headers=admin_headers,
            json={
                "email": unique_email,
                "discord_username": "PriceTest1Month#1234",
                "product": product,
                "message": "Testing 1 Month price"
            }
        )
        assert create_response.status_code in [200, 201]
        request_id = create_response.json()["id"]
        
        requests.put(f"{BASE_URL}/api/admin/purchase-requests/{request_id}/status?status=approved", headers=admin_headers)
        requests.put(f"{BASE_URL}/api/admin/purchase-requests/{request_id}/status?status=completed", headers=admin_headers)
        
        purchases = requests.get(f"{BASE_URL}/api/purchases/", headers=admin_headers).json()
        matching_purchase = next((p for p in purchases if p.get("product") == product and p.get("price") == expected_price), None)
        
        assert matching_purchase is not None, f"No purchase found with product={product} and price={expected_price}"
        print(f"✅ 1 Month purchase created with correct price: {expected_price}")
        
        requests.delete(f"{BASE_URL}/api/admin/purchase-requests/{request_id}", headers=admin_headers)
    
    def test_complete_creates_purchase_with_correct_price_2_months(self, admin_headers):
        """Test that completing creates purchase with correct price for 2 Months ($11.99)"""
        product = "JustPeek - 2 Months"
        expected_price = "$11.99"
        
        unique_email = f"test_price_2months_{uuid.uuid4().hex[:8]}@test.com"
        create_response = requests.post(
            f"{BASE_URL}/api/purchase-requests/",
            headers=admin_headers,
            json={
                "email": unique_email,
                "discord_username": "PriceTest2Months#1234",
                "product": product,
                "message": "Testing 2 Months price"
            }
        )
        assert create_response.status_code in [200, 201]
        request_id = create_response.json()["id"]
        
        requests.put(f"{BASE_URL}/api/admin/purchase-requests/{request_id}/status?status=approved", headers=admin_headers)
        requests.put(f"{BASE_URL}/api/admin/purchase-requests/{request_id}/status?status=completed", headers=admin_headers)
        
        purchases = requests.get(f"{BASE_URL}/api/purchases/", headers=admin_headers).json()
        matching_purchase = next((p for p in purchases if p.get("product") == product and p.get("price") == expected_price), None)
        
        assert matching_purchase is not None, f"No purchase found with product={product} and price={expected_price}"
        print(f"✅ 2 Months purchase created with correct price: {expected_price}")
        
        requests.delete(f"{BASE_URL}/api/admin/purchase-requests/{request_id}", headers=admin_headers)
    
    def test_cancel_does_not_create_purchase(self, admin_headers):
        """Test that cancelling a request does NOT create a purchase record"""
        stats_before = requests.get(f"{BASE_URL}/api/admin/stats", headers=admin_headers).json()
        total_purchases_before = stats_before["total_purchases"]
        
        unique_email = f"test_cancel_no_purchase_{uuid.uuid4().hex[:8]}@test.com"
        create_response = requests.post(
            f"{BASE_URL}/api/purchase-requests/",
            headers=admin_headers,
            json={
                "email": unique_email,
                "discord_username": "CancelNoPurchase#1234",
                "product": "JustPeek - 1 Month",
                "message": "Testing cancel doesn't create purchase"
            }
        )
        assert create_response.status_code in [200, 201]
        request_id = create_response.json()["id"]
        
        # Approve then cancel
        requests.put(f"{BASE_URL}/api/admin/purchase-requests/{request_id}/status?status=approved", headers=admin_headers)
        requests.put(f"{BASE_URL}/api/admin/purchase-requests/{request_id}/status?status=cancelled", headers=admin_headers)
        
        stats_after = requests.get(f"{BASE_URL}/api/admin/stats", headers=admin_headers).json()
        total_purchases_after = stats_after["total_purchases"]
        
        assert total_purchases_after == total_purchases_before, \
            f"Cancelling should NOT create purchase! Before: {total_purchases_before}, After: {total_purchases_after}"
        print("✅ Cancelling a request does NOT create a purchase record")
        
        requests.delete(f"{BASE_URL}/api/admin/purchase-requests/{request_id}", headers=admin_headers)


class TestAdminStats:
    """Test GET /api/admin/stats returns approved_requests and completed_requests counts"""
    
    def test_stats_includes_approved_requests(self, admin_headers):
        """Test that stats includes approved_requests count"""
        response = requests.get(f"{BASE_URL}/api/admin/stats", headers=admin_headers)
        assert response.status_code == 200, f"Stats failed: {response.text}"
        stats = response.json()
        
        assert "approved_requests" in stats, f"approved_requests not in stats: {stats.keys()}"
        assert isinstance(stats["approved_requests"], int), f"approved_requests should be int"
        print(f"✅ Stats includes approved_requests: {stats['approved_requests']}")
    
    def test_stats_includes_completed_requests(self, admin_headers):
        """Test that stats includes completed_requests count"""
        response = requests.get(f"{BASE_URL}/api/admin/stats", headers=admin_headers)
        assert response.status_code == 200
        stats = response.json()
        
        assert "completed_requests" in stats, f"completed_requests not in stats: {stats.keys()}"
        assert isinstance(stats["completed_requests"], int), f"completed_requests should be int"
        print(f"✅ Stats includes completed_requests: {stats['completed_requests']}")
    
    def test_stats_counts_are_accurate(self, admin_headers):
        """Test that approved and completed counts update correctly"""
        # Get initial counts
        stats_before = requests.get(f"{BASE_URL}/api/admin/stats", headers=admin_headers).json()
        approved_before = stats_before["approved_requests"]
        completed_before = stats_before["completed_requests"]
        
        # Create and approve a request
        unique_email = f"test_stats_count_{uuid.uuid4().hex[:8]}@test.com"
        create_response = requests.post(
            f"{BASE_URL}/api/purchase-requests/",
            headers=admin_headers,
            json={
                "email": unique_email,
                "discord_username": "StatsCount#1234",
                "product": "JustPeek - 1 Month",
                "message": "Testing stats counts"
            }
        )
        assert create_response.status_code in [200, 201]
        request_id = create_response.json()["id"]
        
        # Approve
        requests.put(f"{BASE_URL}/api/admin/purchase-requests/{request_id}/status?status=approved", headers=admin_headers)
        
        stats_after_approve = requests.get(f"{BASE_URL}/api/admin/stats", headers=admin_headers).json()
        assert stats_after_approve["approved_requests"] == approved_before + 1, "Approved count should increase by 1"
        print(f"✅ Approved count increased: {approved_before} → {stats_after_approve['approved_requests']}")
        
        # Complete
        requests.put(f"{BASE_URL}/api/admin/purchase-requests/{request_id}/status?status=completed", headers=admin_headers)
        
        stats_after_complete = requests.get(f"{BASE_URL}/api/admin/stats", headers=admin_headers).json()
        # After completing, approved count should decrease by 1, completed should increase by 1
        assert stats_after_complete["completed_requests"] == completed_before + 1, "Completed count should increase by 1"
        print(f"✅ Completed count increased: {completed_before} → {stats_after_complete['completed_requests']}")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/admin/purchase-requests/{request_id}", headers=admin_headers)


class TestAnalyticsEndpoint:
    """Test GET /api/admin/analytics returns chart data"""
    
    def test_analytics_endpoint_exists(self, admin_headers):
        """Test that /api/admin/analytics endpoint exists and returns 200"""
        response = requests.get(f"{BASE_URL}/api/admin/analytics", headers=admin_headers)
        assert response.status_code == 200, f"Analytics endpoint failed: {response.text}"
        print("✅ Analytics endpoint exists and returns 200")
    
    def test_analytics_includes_daily_registrations(self, admin_headers):
        """Test analytics includes daily_registrations array"""
        response = requests.get(f"{BASE_URL}/api/admin/analytics", headers=admin_headers)
        assert response.status_code == 200
        analytics = response.json()
        
        assert "daily_registrations" in analytics, f"daily_registrations not in analytics"
        assert isinstance(analytics["daily_registrations"], list), "daily_registrations should be a list"
        
        # Check structure of items
        if len(analytics["daily_registrations"]) > 0:
            item = analytics["daily_registrations"][0]
            assert "date" in item, "daily_registrations items should have 'date'"
            assert "count" in item, "daily_registrations items should have 'count'"
        
        print(f"✅ Analytics includes daily_registrations: {len(analytics['daily_registrations'])} items")
    
    def test_analytics_includes_monthly_revenue(self, admin_headers):
        """Test analytics includes monthly_revenue array"""
        response = requests.get(f"{BASE_URL}/api/admin/analytics", headers=admin_headers)
        assert response.status_code == 200
        analytics = response.json()
        
        assert "monthly_revenue" in analytics, "monthly_revenue not in analytics"
        assert isinstance(analytics["monthly_revenue"], list), "monthly_revenue should be a list"
        
        if len(analytics["monthly_revenue"]) > 0:
            item = analytics["monthly_revenue"][0]
            assert "month" in item, "monthly_revenue items should have 'month'"
            assert "revenue" in item, "monthly_revenue items should have 'revenue'"
        
        print(f"✅ Analytics includes monthly_revenue: {len(analytics['monthly_revenue'])} items")
    
    def test_analytics_includes_daily_revenue(self, admin_headers):
        """Test analytics includes daily_revenue array"""
        response = requests.get(f"{BASE_URL}/api/admin/analytics", headers=admin_headers)
        assert response.status_code == 200
        analytics = response.json()
        
        assert "daily_revenue" in analytics, "daily_revenue not in analytics"
        assert isinstance(analytics["daily_revenue"], list), "daily_revenue should be a list"
        
        if len(analytics["daily_revenue"]) > 0:
            item = analytics["daily_revenue"][0]
            assert "date" in item, "daily_revenue items should have 'date'"
            assert "revenue" in item, "daily_revenue items should have 'revenue'"
        
        print(f"✅ Analytics includes daily_revenue: {len(analytics['daily_revenue'])} items")
    
    def test_analytics_includes_status_distribution(self, admin_headers):
        """Test analytics includes status_distribution for pie chart"""
        response = requests.get(f"{BASE_URL}/api/admin/analytics", headers=admin_headers)
        assert response.status_code == 200
        analytics = response.json()
        
        assert "status_distribution" in analytics, "status_distribution not in analytics"
        assert isinstance(analytics["status_distribution"], list), "status_distribution should be a list"
        
        # Should have items for each status
        if len(analytics["status_distribution"]) > 0:
            item = analytics["status_distribution"][0]
            assert "name" in item, "status_distribution items should have 'name'"
            assert "value" in item, "status_distribution items should have 'value'"
            # Optional: color for pie chart
        
        # Verify we have the expected statuses
        status_names = [s["name"] for s in analytics["status_distribution"]]
        expected_statuses = ["Beklemede", "Onaylandı", "Tamamlandı", "Reddedildi", "İptal"]
        for expected in expected_statuses:
            assert expected in status_names, f"Missing status '{expected}' in distribution"
        
        print(f"✅ Analytics includes status_distribution with all statuses: {status_names}")
    
    def test_analytics_includes_product_distribution(self, admin_headers):
        """Test analytics includes product_distribution for popularity chart"""
        response = requests.get(f"{BASE_URL}/api/admin/analytics", headers=admin_headers)
        assert response.status_code == 200
        analytics = response.json()
        
        assert "product_distribution" in analytics, "product_distribution not in analytics"
        assert isinstance(analytics["product_distribution"], list), "product_distribution should be a list"
        
        if len(analytics["product_distribution"]) > 0:
            item = analytics["product_distribution"][0]
            assert "name" in item, "product_distribution items should have 'name'"
            assert "value" in item, "product_distribution items should have 'value'"
        
        print(f"✅ Analytics includes product_distribution: {len(analytics['product_distribution'])} products")


class TestAnalyticsRequiresAuth:
    """Test that analytics endpoint requires admin authentication"""
    
    def test_analytics_without_auth_fails(self):
        """Test analytics endpoint requires authentication"""
        response = requests.get(f"{BASE_URL}/api/admin/analytics")
        assert response.status_code in [401, 403], f"Should require auth: {response.status_code}"
        print("✅ Analytics endpoint requires authentication")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
