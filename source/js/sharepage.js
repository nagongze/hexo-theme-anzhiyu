function sharePage() {
    if (navigator.share) {
      navigator.share({
        title: document.title,
        url: location.href
      });
    } else {
      console.log('Web Share API 不支援');
    }
  }